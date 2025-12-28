/**
 * Admin Login API Endpoint
 * POST /api/admin/login
 * 
 * Security features:
 * - Rate limiting (5 attempts per 15 minutes)
 * - bcrypt password verification
 * - JWT session in HttpOnly cookie
 * - No password stored in logs or response
 */

import { NextRequest, NextResponse } from "next/server";
import {
    verifyAdminPassword,
    createAdminSession,
    checkRateLimit,
    recordFailedAttempt,
    clearRateLimit,
    isAdminAuthConfigured,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
    try {
        // Check if admin auth is configured
        if (!isAdminAuthConfigured()) {
            // Debug: Log which env var is missing
            const hasHash = !!process.env.ADMIN_PASSWORD_HASH;
            const hasSecret = !!process.env.JWT_SECRET;
            console.error("Admin auth not configured:", {
                ADMIN_PASSWORD_HASH: hasHash ? "set" : "MISSING",
                JWT_SECRET: hasSecret ? "set" : "MISSING",
            });

            return NextResponse.json(
                {
                    error: "Admin authentication not configured",
                    debug: process.env.NODE_ENV === "development" ? {
                        ADMIN_PASSWORD_HASH: hasHash ? "configured" : "missing",
                        JWT_SECRET: hasSecret ? "configured" : "missing",
                    } : undefined
                },
                { status: 503 }
            );
        }

        // Get client IP for rate limiting
        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        // Check rate limit
        const rateLimit = checkRateLimit(ip);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: "Too many login attempts",
                    retryAfter: rateLimit.resetInSeconds,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": rateLimit.resetInSeconds.toString(),
                    },
                }
            );
        }

        // Parse request body
        let body: { password?: string };
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const { password } = body;

        // Validate input
        if (!password || typeof password !== "string") {
            return NextResponse.json(
                { error: "Password is required" },
                { status: 400 }
            );
        }

        // Verify password
        const isValid = await verifyAdminPassword(password);

        if (!isValid) {
            // Record failed attempt
            recordFailedAttempt(ip);

            const updatedRateLimit = checkRateLimit(ip);

            return NextResponse.json(
                {
                    error: "Invalid password",
                    remainingAttempts: updatedRateLimit.remainingAttempts,
                },
                { status: 401 }
            );
        }

        // Password is valid - create session
        await createAdminSession();

        // Clear rate limit for successful login
        clearRateLimit(ip);

        return NextResponse.json({
            success: true,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
