import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import {
  upsertUser,
  getUserByEmail,
  updateShopifyCustomerId,
} from "@/lib/supabase-user";
import {
  getOrCreateShopifyCustomer,
  isAdminApiConfigured,
} from "@/lib/shopify-admin";

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// JWT secret as Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

interface GooglePayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  aud: string;
  iss: string;
  exp: number;
}

/**
 * Verify Google OAuth token using Google's tokeninfo endpoint
 */
async function verifyGoogleToken(credential: string): Promise<GooglePayload> {
  // Use Google's tokeninfo endpoint to verify the credential
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
  );

  if (!response.ok) {
    throw new Error("Invalid Google token");
  }

  const payload = await response.json();

  // Verify the audience matches our client ID
  if (payload.aud !== GOOGLE_CLIENT_ID) {
    throw new Error("Token was not issued for this application");
  }

  // Verify the token is not expired
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    throw new Error("Token has expired");
  }

  return payload as GooglePayload;
}

/**
 * Generate a session JWT token for our app
 */
async function createSessionToken(
  email: string,
  name: string | null,
  picture: string | null
): Promise<string> {
  const token = await new SignJWT({
    email,
    name,
    picture,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  return token;
}

/**
 * POST: Login with Google OAuth
 *
 * Flow:
 * 1. Receive Google credential from frontend
 * 2. Verify with Google
 * 3. Upsert user in Supabase
 * 4. Return session token + user data + saved cart/wishlist
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, joinKumaranFamily } = body;

    if (!credential) {
      return NextResponse.json(
        { success: false, error: "No credential provided" },
        { status: 400 }
      );
    }

    // Step 1: Verify Google token
    let googlePayload: GooglePayload;
    try {
      googlePayload = await verifyGoogleToken(credential);
    } catch (error) {
      console.error("Google token verification failed:", error);
      return NextResponse.json(
        { success: false, error: "Invalid Google token" },
        { status: 401 }
      );
    }

    const { email, name, given_name, family_name, picture, email_verified } =
      googlePayload;
    console.log("Google user verified:", email);

    if (!email_verified) {
      return NextResponse.json(
        { success: false, error: "Email not verified with Google" },
        { status: 401 }
      );
    }

    // Step 2: Upsert user in Supabase
    const user = await upsertUser(email, name, picture);
    console.log("User upserted in Supabase:", user.email);

    // Step 2.5: Create/sync Shopify customer (if Admin API is configured)
    let shopifyCustomerId: string | null = null;
    if (isAdminApiConfigured()) {
      try {
        const shopifyResult = await getOrCreateShopifyCustomer(
          email,
          name || email.split("@")[0],
          picture,
          joinKumaranFamily || false // New parameter
        );
        if (shopifyResult) {
          shopifyCustomerId = shopifyResult.customerId;
          console.log(
            `Shopify customer ${shopifyResult.isNew ? "created" : "found"}:`,
            shopifyCustomerId
          );

          // Save Shopify customer ID to Supabase for future lookups
          try {
            await updateShopifyCustomerId(email, shopifyCustomerId);
            console.log("Shopify customer ID saved to Supabase");
          } catch (saveError) {
            console.error(
              "Failed to save Shopify customer ID to Supabase:",
              saveError
            );
          }
        }
      } catch (error) {
        // Log but don't fail - Shopify sync is nice-to-have
        console.error("Shopify customer sync failed:", error);
      }
    } else {
      console.log("Shopify Admin API not configured, skipping customer sync");
    }

    // Step 3: Generate session token
    const sessionToken = await createSessionToken(
      email,
      name || null,
      picture || null
    );

    // Step 4: Return success with user data and saved cart/wishlist
    const response = NextResponse.json({
      success: true,
      customer: {
        id: user.id,
        email: user.email,
        firstName: given_name || name?.split(" ")[0] || null,
        lastName: family_name || name?.split(" ").slice(1).join(" ") || null,
        name: name || email,
        picture: picture || null,
        verifiedEmail: true,
        authMethod: "google",
        shopifyCustomerId, // Shopify customer ID for cart association
      },
      // Return saved cart and wishlist for restoration
      savedCartId: user.cart_id,
      savedWishlistProductIds: user.wishlist_product_ids || [],
    });

    // Set httpOnly cookie for session (hok_auth_token is checked by middleware)
    response.cookies.set("hok_auth_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Also set a non-httpOnly status cookie for client-side auth checks
    response.cookies.set("hok_auth_status", "authenticated", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET: Verify session and get user data
 */
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("hok_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "No session" },
        { status: 401 }
      );
    }

    // Verify session token
    const { payload } = await jwtVerify(sessionToken, secret);
    const email = payload.email as string;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    // Get user from Supabase
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        picture: user.picture,
        verifiedEmail: true,
        authMethod: "google",
      },
      savedCartId: user.cart_id,
      savedWishlistProductIds: user.wishlist_product_ids || [],
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid session" },
      { status: 401 }
    );
  }
}

/**
 * DELETE: Logout
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  // Clear the session cookie
  response.cookies.set("hok_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
