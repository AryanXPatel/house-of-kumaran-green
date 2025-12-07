import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getUserByEmail } from "@/lib/supabase-user";
import { joinKumaranFamily, getCustomerById, isKumaranFamilyMember } from "@/lib/shopify-admin";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * POST: Join Kumaran Family (for authenticated users)
 * Updates the Shopify customer to subscribe to marketing and add the tag
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const sessionToken = request.cookies.get("hok_auth_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT
    let email: string;
    try {
      const { payload } = await jwtVerify(sessionToken, secret);
      email = payload.email as string;
      if (!email) {
        throw new Error("No email in token");
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    // Get user from Supabase to find Shopify customer ID
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.shopify_customer_id) {
      return NextResponse.json(
        { success: false, error: "No Shopify customer linked. Please sign out and sign in again." },
        { status: 400 }
      );
    }

    // Check if already a member
    const customer = await getCustomerById(user.shopify_customer_id);
    if (customer && isKumaranFamilyMember(customer)) {
      return NextResponse.json({
        success: true,
        alreadyMember: true,
        message: "You're already part of the Kumaran Family!",
      });
    }

    // Join Kumaran Family
    const success = await joinKumaranFamily(user.shopify_customer_id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to join. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      alreadyMember: false,
      message: "Welcome to the Kumaran Family! You'll now receive 5% off forever.",
    });
  } catch (error) {
    console.error("Join Kumaran Family error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET: Check if user is a Kumaran Family member
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const sessionToken = request.cookies.get("hok_auth_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, isMember: false },
        { status: 200 }
      );
    }

    // Verify JWT
    let email: string;
    try {
      const { payload } = await jwtVerify(sessionToken, secret);
      email = payload.email as string;
      if (!email) {
        throw new Error("No email in token");
      }
    } catch {
      return NextResponse.json(
        { success: false, isMember: false },
        { status: 200 }
      );
    }

    // Get user from Supabase
    const user = await getUserByEmail(email);

    if (!user?.shopify_customer_id) {
      return NextResponse.json({
        success: true,
        isMember: false,
      });
    }

    // Check membership
    const customer = await getCustomerById(user.shopify_customer_id);
    const isMember = isKumaranFamilyMember(customer);

    return NextResponse.json({
      success: true,
      isMember,
    });
  } catch (error) {
    console.error("Check membership error:", error);
    return NextResponse.json({
      success: false,
      isMember: false,
    });
  }
}
