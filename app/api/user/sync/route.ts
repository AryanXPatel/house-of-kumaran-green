import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  updateCartId,
  updateWishlist,
  getCartId,
  getWishlistProductIds,
} from "@/lib/supabase-user";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Get email from session cookie
 */
async function getEmailFromSession(
  request: NextRequest
): Promise<string | null> {
  const sessionToken = request.cookies.get("hok_session")?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionToken, secret);
    return payload.email as string;
  } catch {
    return null;
  }
}

/**
 * POST: Sync cart or wishlist to Supabase
 *
 * Body: { type: 'cart' | 'wishlist', data: string | string[] }
 * - For cart: data is the Shopify cart ID string
 * - For wishlist: data is an array of product IDs
 */
export async function POST(request: NextRequest) {
  try {
    const email = await getEmailFromSession(request);

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type || data === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing type or data" },
        { status: 400 }
      );
    }

    if (type === "cart") {
      // Update cart ID
      if (typeof data !== "string" && data !== null) {
        return NextResponse.json(
          { success: false, error: "Cart ID must be a string or null" },
          { status: 400 }
        );
      }

      await updateCartId(email, data);
      console.log(`Cart synced for ${email}: ${data ? "updated" : "cleared"}`);

      return NextResponse.json({ success: true });
    }

    if (type === "wishlist") {
      // Update wishlist product IDs
      if (!Array.isArray(data)) {
        return NextResponse.json(
          { success: false, error: "Wishlist must be an array of product IDs" },
          { status: 400 }
        );
      }

      await updateWishlist(email, data);
      console.log(`Wishlist synced for ${email}: ${data.length} items`);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type. Must be "cart" or "wishlist"' },
      { status: 400 }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync data" },
      { status: 500 }
    );
  }
}

/**
 * GET: Fetch cart or wishlist from Supabase
 *
 * Query params: type=cart|wishlist
 */
export async function GET(request: NextRequest) {
  try {
    const email = await getEmailFromSession(request);

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Missing type parameter" },
        { status: 400 }
      );
    }

    if (type === "cart") {
      const cartId = await getCartId(email);
      console.log(
        `Cart fetched for ${email}: ${cartId ? "found" : "not found"}`
      );
      return NextResponse.json({ success: true, data: cartId });
    }

    if (type === "wishlist") {
      const wishlistProductIds = await getWishlistProductIds(email);
      console.log(
        `Wishlist fetched for ${email}: ${wishlistProductIds.length} items`
      );
      return NextResponse.json({ success: true, data: wishlistProductIds });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type. Must be "cart" or "wishlist"' },
      { status: 400 }
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
