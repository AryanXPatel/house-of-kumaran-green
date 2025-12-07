import { NextRequest, NextResponse } from "next/server";

/**
 * Initiate OAuth flow to install the HoK Customer Sync app
 * Visit /api/shopify/install to start the OAuth process
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.HOK_CUSTOMER_SYNC_CLIENT_ID;
  const shopDomain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "houseofkumaran.myshopify.com";

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing HOK_CUSTOMER_SYNC_CLIENT_ID" },
      { status: 500 }
    );
  }

  // Get the redirect URI (this same domain)
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/shopify/callback`;

  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(7);

  // Build the authorization URL
  const scopes = "read_customers,write_customers";
  const authUrl = new URL(`https://${shopDomain}/admin/oauth/authorize`);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);

  console.log("Redirecting to Shopify OAuth:", authUrl.toString());
  console.log("Redirect URI:", redirectUri);

  // Redirect to Shopify authorization
  return NextResponse.redirect(authUrl.toString());
}
