import { NextRequest, NextResponse } from "next/server";

/**
 * OAuth callback handler for HoK Customer Sync app
 * This receives the authorization code from Shopify and exchanges it for an access token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const shop = searchParams.get("shop");
  const state = searchParams.get("state");
  const hmac = searchParams.get("hmac");

  console.log("OAuth callback received:", { shop, state, hasCode: !!code, hasHmac: !!hmac });

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const clientId = process.env.HOK_CUSTOMER_SYNC_CLIENT_ID;
  const clientSecret = process.env.HOK_CUSTOMER_SYNC_CLIENT_SECRET;
  const shopDomain = shop || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing client credentials" },
      { status: 500 }
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenUrl = `https://${shopDomain}/admin/oauth/access_token`;
    
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const responseText = await response.text();
    console.log("Token exchange response:", response.status, responseText);

    if (!response.ok) {
      return NextResponse.json({
        error: "Token exchange failed",
        status: response.status,
        details: responseText,
      }, { status: 500 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json({
        error: "Failed to parse token response",
        response: responseText,
      }, { status: 500 });
    }

    // SUCCESS! Display the token for the user to copy
    console.log("===========================================");
    console.log("SUCCESS! HoK Customer Sync App authorized!");
    console.log("Add this to your .env.local file:");
    console.log(`HOK_CUSTOMER_SYNC_ACCESS_TOKEN=${data.access_token}`);
    console.log("===========================================");

    // Return HTML page with the token
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>HoK Customer Sync - Installed!</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #0d1f14; color: #f5f0e1; }
    h1 { color: #b8860b; }
    .success { background: #1a472a; border: 2px solid #2a4a35; padding: 20px; border-radius: 12px; margin: 20px 0; }
    .token { background: #0d1f14; border: 1px solid #b8860b; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 14px; margin: 10px 0; }
    .env-line { background: #1a472a; padding: 10px 15px; border-radius: 8px; font-family: monospace; font-size: 12px; margin: 10px 0; overflow-x: auto; }
    button { background: #b8860b; color: #0d1f14; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin: 5px; }
    button:hover { background: #d4a017; }
    .step { background: #1a472a; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #b8860b; }
    .step h3 { margin: 0 0 10px 0; color: #b8860b; }
  </style>
</head>
<body>
  <h1>✅ HoK Customer Sync App Installed!</h1>
  
  <div class="success">
    <h2>Your Access Token</h2>
    <div class="token" id="token">${data.access_token}</div>
    <button onclick="navigator.clipboard.writeText('${data.access_token}'); alert('Token copied!')">Copy Token</button>
  </div>

  <div class="step">
    <h3>Step 1: Add to .env.local</h3>
    <div class="env-line">HOK_CUSTOMER_SYNC_ACCESS_TOKEN=${data.access_token}</div>
    <button onclick="navigator.clipboard.writeText('HOK_CUSTOMER_SYNC_ACCESS_TOKEN=${data.access_token}'); alert('Copied!')">Copy Full Line</button>
  </div>

  <div class="step">
    <h3>Step 2: Restart your dev server</h3>
    <p>Run: <code>npm run dev</code></p>
  </div>

  <div class="step">
    <h3>Step 3: Done! 🎉</h3>
    <p>Google OAuth users will now be synced to your Shopify store as customers!</p>
  </div>

  <p style="margin-top: 30px;"><a href="/" style="color: #b8860b;">← Back to Home</a></p>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json({
      error: "OAuth callback failed",
      details: String(error),
    }, { status: 500 });
  }
}
