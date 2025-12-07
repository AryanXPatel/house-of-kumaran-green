import { NextRequest, NextResponse } from "next/server";

/**
 * Get access token for HoK Customer Sync app using Client Credentials Grant
 * This is for API-only apps created via Dev Dashboard
 *
 * For Dev Dashboard apps, after installation, you use client_credentials grant
 * to get an offline access token
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.HOK_CUSTOMER_SYNC_CLIENT_ID;
  const clientSecret = process.env.HOK_CUSTOMER_SYNC_CLIENT_SECRET;
  const shopDomain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "houseofkumaran.myshopify.com";

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error:
          "Missing HOK_CUSTOMER_SYNC_CLIENT_ID or HOK_CUSTOMER_SYNC_CLIENT_SECRET",
      },
      { status: 500 }
    );
  }

  try {
    // For Dev Dashboard API-only apps, use client_credentials grant
    const tokenUrl = `https://${shopDomain}/admin/oauth/access_token`;

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    });

    const responseText = await response.text();
    console.log("Token response status:", response.status);
    console.log("Token response:", responseText);

    if (!response.ok) {
      // If client_credentials doesn't work, provide instructions
      return NextResponse.json(
        {
          error: "Client credentials grant failed",
          status: response.status,
          response: responseText,
          alternativeSteps: [
            "The Dev Dashboard app may need to be installed differently.",
            "Go to: https://dev.shopify.com/dashboard/",
            "Click on your 'HoK Customer Sync' app",
            "Check if there's an 'API credentials' or 'Access tokens' section",
            "Or try reinstalling the app on your store",
          ],
          shopDomain,
        },
        { status: 400 }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse response",
          responseText,
        },
        { status: 500 }
      );
    }

    console.log("===========================================");
    console.log("SUCCESS! Add this to your .env.local:");
    console.log(`HOK_CUSTOMER_SYNC_ACCESS_TOKEN=${data.access_token}`);
    console.log("===========================================");

    return NextResponse.json({
      success: true,
      message: "Add this to your .env.local file:",
      envLine: `HOK_CUSTOMER_SYNC_ACCESS_TOKEN=${data.access_token}`,
      accessToken: data.access_token, // For easy copy
      scope: data.scope,
    });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json(
      { error: "Failed to get token", details: String(error) },
      { status: 500 }
    );
  }
}
