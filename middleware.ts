/**
 * Auth Middleware - Verify JWT for protected routes
 * Extended to support admin subdomain and admin authentication
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Routes that require customer authentication
const protectedRoutes = ["/account"];

// Admin routes that require admin authentication
const adminRoutes = ["/admin/analytics"];

// Admin login page (public on admin subdomain)
const adminLoginRoute = "/admin/login";

// Admin session cookie name
const ADMIN_SESSION_COOKIE = "hok_admin_session";

/**
 * Check if request is from admin subdomain
 */
function isAdminSubdomain(request: NextRequest): boolean {
  const host = request.headers.get("host") || "";

  // Check for admin subdomain (admin.houseofkumaran.com or admin.localhost)
  return (
    host.startsWith("admin.") ||
    host.includes("admin.houseofkumaran.com") ||
    host.includes("admin.localhost")
  );
}

/**
 * Verify admin session JWT
 */
async function verifyAdminSessionMiddleware(token: string): Promise<boolean> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = isAdminSubdomain(request);

  // ===================================
  // ADMIN SUBDOMAIN HANDLING
  // ===================================
  if (isAdmin) {
    // Allow admin login page without auth
    if (pathname === adminLoginRoute || pathname === "/admin/login") {
      // If already logged in, redirect to dashboard
      const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      if (adminToken) {
        const isValidSession = await verifyAdminSessionMiddleware(adminToken);
        if (isValidSession) {
          return NextResponse.redirect(new URL("/admin/analytics", request.url));
        }
      }
      return NextResponse.next();
    }

    // Allow API routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Root of admin subdomain - redirect to analytics or login
    if (pathname === "/" || pathname === "/admin") {
      const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      if (adminToken) {
        const isValidSession = await verifyAdminSessionMiddleware(adminToken);
        if (isValidSession) {
          return NextResponse.redirect(new URL("/admin/analytics", request.url));
        }
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Protected admin routes - require admin session
    if (pathname.startsWith("/admin/") && pathname !== "/admin/login") {
      const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

      if (!adminToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      const isValidSession = await verifyAdminSessionMiddleware(adminToken);
      if (!isValidSession) {
        // Clear invalid session and redirect to login
        const response = NextResponse.redirect(
          new URL("/admin/login", request.url)
        );
        response.cookies.delete(ADMIN_SESSION_COOKIE);
        return response;
      }

      return NextResponse.next();
    }

    // Block non-admin routes on admin subdomain
    // Redirect to main site for shop pages, etc.
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
      const mainSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://houseofkumaran.com";
      return NextResponse.redirect(new URL(pathname, mainSiteUrl));
    }
  }

  // ===================================
  // MAIN SITE - ADMIN ROUTES
  // ===================================
  // Protect admin routes even on main domain
  if (pathname.startsWith("/admin/") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const isValidSession = await verifyAdminSessionMiddleware(adminToken);
    if (!isValidSession) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }

    return NextResponse.next();
  }

  // ===================================
  // CUSTOMER AUTHENTICATION
  // ===================================
  // Check if route needs customer protection
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get auth token from cookie
  const authToken = request.cookies.get("hok_auth_token")?.value;

  // Also check for traditional Shopify token (for email/password auth)
  const hasLegacyAuth = request.cookies.get("shopify_customer_token")?.value;

  // If no tokens present, redirect to home
  if (!authToken && !hasLegacyAuth) {
    const url = new URL("/", request.url);
    url.searchParams.set("auth", "required");
    return NextResponse.redirect(url);
  }

  // Verify JWT if present (for Google OAuth)
  if (authToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET not configured");
        return NextResponse.next(); // Allow access if JWT_SECRET missing (development)
      }

      await jwtVerify(authToken, secret);

      // Token is valid, continue
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error);

      // Clear invalid token and redirect
      const response = NextResponse.redirect(
        new URL("/?auth=expired", request.url)
      );
      response.cookies.delete("hok_auth_token");
      response.cookies.delete("hok_auth_status");
      return response;
    }
  }

  // If only legacy auth exists, let the page handle verification
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match protected routes
    "/account/:path*",
    // Match admin routes
    "/admin/:path*",
    // Match root for admin subdomain redirect
    "/",
  ],
};
