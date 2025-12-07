import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/shopify-admin";

/**
 * POST: Subscribe to newsletter (for guest users)
 * Creates or updates a Shopify customer with marketing consent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Subscribe to newsletter via Shopify Admin API
    const result = await subscribeToNewsletter(email);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Subscription failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isNew: result.isNew,
      message: result.isNew
        ? "Welcome to the Kumaran Family!"
        : "You're now part of the Kumaran Family!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
