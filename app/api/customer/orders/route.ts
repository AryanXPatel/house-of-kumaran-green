// Customer Orders API Route
// Fetches orders for Google OAuth users via Admin API
// (Storefront API requires password-based token, so we use Admin API for Google users)

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getCustomerOrders } from "@/lib/shopify-admin-customer";

interface JWTPayload {
  email: string;
  shopifyCustomerId: string;
  name: string;
  picture?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookie
    const authToken = request.cookies.get("hok_auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = (await jwtVerify(authToken, secret)) as {
      payload: JWTPayload;
    };

    if (!payload.shopifyCustomerId) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    // Get number of orders to fetch from query param
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "20", 10);

    // Fetch orders via Admin API
    const orders = await getCustomerOrders(payload.shopifyCustomerId, first);

    return NextResponse.json({
      success: true,
      orders,
      customerId: payload.shopifyCustomerId,
    });
  } catch (error) {
    console.error("Orders API error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch orders";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
