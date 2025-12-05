import { NextRequest, NextResponse } from "next/server";

// Shopify Admin API credentials
const SHOPIFY_ADMIN_API_URL = process.env.SHOPIFY_ADMIN_API_URL;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// GET - Retrieve saved cart ID from customer metafield
export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    if (!SHOPIFY_ADMIN_API_URL || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Shopify Admin API not configured" },
        { status: 500 }
      );
    }

    // Get customer metafield for cart ID
    const query = `
      query getCustomerCart($id: ID!) {
        customer(id: $id) {
          id
          metafield(namespace: "custom", key: "cart_id") {
            value
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_ADMIN_API_URL + "/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { id: `gid://shopify/Customer/${customerId}` },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Shopify API Error:", data.errors);
      return NextResponse.json({ cartId: null });
    }

    const cartId = data.data?.customer?.metafield?.value;
    return NextResponse.json({ cartId: cartId || null });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ cartId: null });
  }
}

// POST - Save cart ID to customer metafield
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, cartId } = body as {
      customerId: string;
      cartId: string;
    };

    if (!customerId || !cartId) {
      return NextResponse.json(
        { error: "Customer ID and Cart ID are required" },
        { status: 400 }
      );
    }

    if (!SHOPIFY_ADMIN_API_URL || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Shopify Admin API not configured" },
        { status: 500 }
      );
    }

    // Save cart ID to customer metafield
    const mutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_ADMIN_API_URL + "/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            id: `gid://shopify/Customer/${customerId}`,
            metafields: [
              {
                namespace: "custom",
                key: "cart_id",
                type: "single_line_text_field",
                value: cartId,
              },
            ],
          },
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Shopify API Error:", data.errors);
      return NextResponse.json(
        { error: "Failed to save cart" },
        { status: 500 }
      );
    }

    if (data.data?.customerUpdate?.userErrors?.length > 0) {
      console.error("User Errors:", data.data.customerUpdate.userErrors);
      return NextResponse.json(
        { error: data.data.customerUpdate.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json(
      { error: "Failed to save cart" },
      { status: 500 }
    );
  }
}
