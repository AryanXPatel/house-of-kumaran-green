import { NextRequest, NextResponse } from "next/server";
import { findCustomerByEmail, joinKumaranFamily } from "@/lib/shopify-admin";

/**
 * POST: Join Kumaran Family after email registration
 * This endpoint is called when a user registers with email and opts to join
 * the Kumaran Family. Since email signup uses Storefront API (which can't add tags),
 * we need to use Admin API to add the kumaran-family tag.
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

    // Find the customer by email in Shopify Admin API
    const customer = await findCustomerByEmail(email);

    if (!customer) {
      // Customer might not be synced yet, wait a moment and retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const retryCustomer = await findCustomerByEmail(email);

      if (!retryCustomer) {
        return NextResponse.json(
          { success: false, error: "Customer not found in Shopify" },
          { status: 404 }
        );
      }

      // Join Kumaran Family
      const success = await joinKumaranFamily(retryCustomer.id);
      return NextResponse.json({
        success,
        message: success
          ? "Welcome to the Kumaran Family!"
          : "Failed to join Kumaran Family",
      });
    }

    // Check if already a member
    if (customer.tags.includes("kumaran-family")) {
      return NextResponse.json({
        success: true,
        message: "You're already part of the Kumaran Family!",
        alreadyMember: true,
      });
    }

    // Join Kumaran Family (add tag + update marketing consent)
    const success = await joinKumaranFamily(customer.id);

    if (success) {
      console.log(`Email user ${email} joined Kumaran Family`);
      return NextResponse.json({
        success: true,
        message: "Welcome to the Kumaran Family! You'll now receive 5% off forever.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Failed to join Kumaran Family" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in register-family:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
