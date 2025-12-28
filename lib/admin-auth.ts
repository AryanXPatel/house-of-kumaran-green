/**
 * Admin Authentication Library
 * Secure authentication for admin dashboard access
 * 
 * Security features:
 * - bcrypt password hashing (12 rounds)
 * - JWT sessions with HttpOnly cookies
 * - Rate limiting for brute force protection
 * - No SQL injection risk (bcrypt compare only)
 */

import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Constants
const ADMIN_SESSION_COOKIE = "hok_admin_session";
const SESSION_EXPIRY_HOURS = 24;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// In-memory rate limiting store (use Redis in production for multi-instance)
const rateLimitStore = new Map<string, { attempts: number; resetAt: number }>();

/**
 * Get the admin password hash from environment
 * IMPORTANT: Generate this using the hash generator script
 */
function getPasswordHash(): string | null {
    return process.env.ADMIN_PASSWORD_HASH || null;
}

/**
 * Get JWT secret for signing tokens
 */
function getJwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters");
    }
    return new TextEncoder().encode(secret);
}

/**
 * Check rate limiting for an IP address
 * Returns: { allowed: boolean, remainingAttempts: number, resetInSeconds: number }
 */
export function checkRateLimit(ip: string): {
    allowed: boolean;
    remainingAttempts: number;
    resetInSeconds: number;
} {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    // Clean up expired records
    if (record && now > record.resetAt) {
        rateLimitStore.delete(ip);
    }

    const currentRecord = rateLimitStore.get(ip);

    if (!currentRecord) {
        return {
            allowed: true,
            remainingAttempts: MAX_ATTEMPTS,
            resetInSeconds: 0,
        };
    }

    const remaining = MAX_ATTEMPTS - currentRecord.attempts;
    const resetInSeconds = Math.ceil((currentRecord.resetAt - now) / 1000);

    return {
        allowed: remaining > 0,
        remainingAttempts: Math.max(0, remaining),
        resetInSeconds: Math.max(0, resetInSeconds),
    };
}

/**
 * Record a failed login attempt for rate limiting
 */
export function recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetAt) {
        rateLimitStore.set(ip, {
            attempts: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
    } else {
        record.attempts++;
    }
}

/**
 * Clear rate limit for an IP after successful login
 */
export function clearRateLimit(ip: string): void {
    rateLimitStore.delete(ip);
}

/**
 * Verify admin password using bcrypt
 * Returns true if password matches, false otherwise
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
    const hash = getPasswordHash();

    if (!hash) {
        console.error("ADMIN_PASSWORD_HASH not configured");
        return false;
    }

    try {
        // Debug logging (remove in production)
        console.log("Password verification debug:", {
            passwordLength: password.length,
            hashLength: hash.length,
            hashPrefix: hash.substring(0, 10) + "...",
        });

        // bcrypt.compare is safe against timing attacks
        const result = await compare(password, hash);
        console.log("bcrypt compare result:", result);
        return result;
    } catch (error) {
        console.error("Password verification error:", error);
        return false;
    }
}

/**
 * Create an admin session JWT and set it as an HttpOnly cookie
 */
export async function createAdminSession(): Promise<string> {
    const secret = getJwtSecret();

    const token = await new SignJWT({
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(`${SESSION_EXPIRY_HOURS}h`)
        .setIssuedAt()
        .sign(secret);

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: SESSION_EXPIRY_HOURS * 60 * 60,
    });

    return token;
}

/**
 * Verify an admin session from the request cookies
 * Returns true if session is valid, false otherwise
 */
export async function verifyAdminSession(token?: string): Promise<boolean> {
    try {
        const sessionToken = token;

        if (!sessionToken) {
            return false;
        }

        const secret = getJwtSecret();
        const { payload } = await jwtVerify(sessionToken, secret);

        // Check if it's an admin token
        return payload.role === "admin";
    } catch (error) {
        // Token expired or invalid
        return false;
    }
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Get admin session token from cookies (for middleware)
 */
export function getAdminSessionCookieName(): string {
    return ADMIN_SESSION_COOKIE;
}

/**
 * Check if admin authentication is properly configured
 */
export function isAdminAuthConfigured(): boolean {
    return !!(getPasswordHash() && process.env.JWT_SECRET);
}
