import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getShopifyCustomerId } from "@/lib/supabase-user";
import {
  getCustomerById,
  updateCustomerProfile,
  addCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
  setDefaultAddress,
  getCustomerOrders,
  isAdminApiConfigured,
  type ShopifyCustomerProfile,
  type ShopifyAddress,
  type ShopifyOrder,
} from "@/lib/shopify-admin";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verify the JWT token and extract email
 */
async function verifyAndGetEmail(request: NextRequest): Promise<string | null> {
  const authToken = request.cookies.get("hok_auth_token")?.value;

  if (!authToken || !JWT_SECRET) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(authToken, secret);
    return payload.email as string;
  } catch {
    return null;
  }
}

/**
 * GET: Fetch customer profile for Google OAuth user
 * Returns Shopify customer data including addresses and optionally orders
 */
export async function GET(request: NextRequest) {
  try {
    // Verify auth
    const email = await verifyAndGetEmail(request);
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if Admin API is configured
    if (!isAdminApiConfigured()) {
      return NextResponse.json(
        { success: false, error: "Admin API not configured" },
        { status: 503 }
      );
    }

    // Get Shopify customer ID from Supabase
    const shopifyCustomerId = await getShopifyCustomerId(email);
    if (!shopifyCustomerId) {
      return NextResponse.json(
        { success: false, error: "No Shopify customer linked" },
        { status: 404 }
      );
    }

    // Check if orders are requested
    const { searchParams } = new URL(request.url);
    const includeOrders = searchParams.get("includeOrders") === "true";

    // Fetch customer profile from Shopify Admin API
    const customer = await getCustomerById(shopifyCustomerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found in Shopify" },
        { status: 404 }
      );
    }

    // Fetch orders if requested
    let orders: ShopifyOrder[] = [];
    if (includeOrders) {
      orders = await getCustomerOrders(shopifyCustomerId, 20);
    }

    return NextResponse.json({
      success: true,
      customer,
      orders: includeOrders ? orders : undefined,
    });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update customer profile for Google OAuth user
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify auth
    const email = await verifyAndGetEmail(request);
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if Admin API is configured
    if (!isAdminApiConfigured()) {
      return NextResponse.json(
        { success: false, error: "Admin API not configured" },
        { status: 503 }
      );
    }

    // Get Shopify customer ID from Supabase
    const shopifyCustomerId = await getShopifyCustomerId(email);
    if (!shopifyCustomerId) {
      return NextResponse.json(
        { success: false, error: "No Shopify customer linked" },
        { status: 404 }
      );
    }

    // Parse update data
    const body = await request.json();
    const { firstName, lastName, phone, acceptsMarketing } = body;

    // Update customer profile
    const success = await updateCustomerProfile(shopifyCustomerId, {
      firstName,
      lastName,
      phone,
      ...(acceptsMarketing !== undefined && {
        emailMarketingConsent: {
          marketingOptInLevel: "SINGLE_OPT_IN",
          marketingState: acceptsMarketing ? "SUBSCRIBED" : "UNSUBSCRIBED",
        },
      }),
    });

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Fetch updated profile
    const customer = await getCustomerById(shopifyCustomerId);

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

/**
 * POST: Add a new address for Google OAuth user
 */
export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const email = await verifyAndGetEmail(request);
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if Admin API is configured
    if (!isAdminApiConfigured()) {
      return NextResponse.json(
        { success: false, error: "Admin API not configured" },
        { status: 503 }
      );
    }

    // Get Shopify customer ID from Supabase
    const shopifyCustomerId = await getShopifyCustomerId(email);
    if (!shopifyCustomerId) {
      return NextResponse.json(
        { success: false, error: "No Shopify customer linked" },
        { status: 404 }
      );
    }

    // Parse address data
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { success: false, error: "Address data required" },
        { status: 400 }
      );
    }

    // Add address
    const newAddress = await addCustomerAddress(shopifyCustomerId, address);

    if (!newAddress) {
      return NextResponse.json(
        { success: false, error: "Failed to add address" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add address" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete an address for Google OAuth user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify auth
    const email = await verifyAndGetEmail(request);
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if Admin API is configured
    if (!isAdminApiConfigured()) {
      return NextResponse.json(
        { success: false, error: "Admin API not configured" },
        { status: 503 }
      );
    }

    // Get Shopify customer ID from Supabase
    const shopifyCustomerId = await getShopifyCustomerId(email);
    if (!shopifyCustomerId) {
      return NextResponse.json(
        { success: false, error: "No Shopify customer linked" },
        { status: 404 }
      );
    }

    // Parse address ID from query params
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: "Address ID required" },
        { status: 400 }
      );
    }

    // Delete address
    const success = await deleteCustomerAddress(shopifyCustomerId, [addressId]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete address" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete address" },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update an address or set default address
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verify auth
    const email = await verifyAndGetEmail(request);
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if Admin API is configured
    if (!isAdminApiConfigured()) {
      return NextResponse.json(
        { success: false, error: "Admin API not configured" },
        { status: 503 }
      );
    }

    // Get Shopify customer ID from Supabase
    const shopifyCustomerId = await getShopifyCustomerId(email);
    if (!shopifyCustomerId) {
      return NextResponse.json(
        { success: false, error: "No Shopify customer linked" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { addressId, setAsDefault, address } = body;

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: "Address ID required" },
        { status: 400 }
      );
    }

    let success = false;

    // Set as default address
    if (setAsDefault) {
      success = await setDefaultAddress(shopifyCustomerId, addressId);
    }
    // Update address
    else if (address) {
      success = await updateCustomerAddress(
        shopifyCustomerId,
        addressId,
        address
      );
    } else {
      return NextResponse.json(
        { success: false, error: "No update data provided" },
        { status: 400 }
      );
    }

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to update address" },
        { status: 500 }
      );
    }

    // Fetch updated customer profile
    const customer = await getCustomerById(shopifyCustomerId);

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update address" },
      { status: 500 }
    );
  }
}
