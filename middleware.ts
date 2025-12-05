// Auth Middleware - Verify JWT for protected routes
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Routes that require authentication
const protectedRoutes = ["/account"];

// Routes that are public
const publicRoutes = [
  "/",
  "/shop",
  "/product",
  "/category",
  "/about",
  "/contact",
  "/cart",
  "/checkout",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
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
  ],
};
