import { NextRequest, NextResponse } from "next/server";

// Shopify Admin API credentials
const SHOPIFY_ADMIN_API_URL = process.env.SHOPIFY_ADMIN_API_URL;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

// GET - Retrieve wishlist from customer metafield
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

    // Get customer metafield for wishlist
    const query = `
      query getCustomerWishlist($id: ID!) {
        customer(id: $id) {
          id
          metafield(namespace: "custom", key: "wishlist") {
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
      return NextResponse.json({ wishlist: [] });
    }

    const metafieldValue = data.data?.customer?.metafield?.value;

    if (metafieldValue) {
      try {
        const wishlist = JSON.parse(metafieldValue);
        return NextResponse.json({ wishlist });
      } catch {
        return NextResponse.json({ wishlist: [] });
      }
    }

    return NextResponse.json({ wishlist: [] });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ wishlist: [] });
  }
}

// POST - Save wishlist to customer metafield
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, wishlist } = body as {
      customerId: string;
      wishlist: WishlistItem[];
    };

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

    // Save wishlist to customer metafield
    const mutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            metafield(namespace: "custom", key: "wishlist") {
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Only save essential data to keep metafield size small
    const wishlistData = wishlist.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
    }));

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
                key: "wishlist",
                type: "json",
                value: JSON.stringify(wishlistData),
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
        { error: "Failed to save wishlist" },
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
    console.error("Error saving wishlist:", error);
    return NextResponse.json(
      { error: "Failed to save wishlist" },
      { status: 500 }
    );
  }
}
