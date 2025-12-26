import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { submitReview } from "@/lib/judgeme";
import {
  hasCustomerPurchasedProduct,
  findCustomerGidByEmail,
  findCustomerByEmail,
} from "@/lib/shopify-admin-customer";
import { getUserByEmail } from "@/lib/supabase-user";

const JWT_SECRET = process.env.JWT_SECRET;

interface JWTPayload {
  email: string;
  name?: string;
}

/**
 * POST /api/reviews
 * Submit a new product review to Judge.me
 * 
 * REQUIRES:
 * - User must be logged in (Google OAuth or email/password)
 * - User must have purchased the product being reviewed
 *
 * Request body:
 * - productId: Shopify product ID
 * - productTitle: Product title
 * - productHandle: Product handle/slug
 * - rating: Rating (1-5)
 * - title: Review title
 * - body: Review body/content
 * 
 * Note: reviewerName and reviewerEmail are now obtained from the authenticated session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // === STEP 1: VERIFY AUTHENTICATION ===
    const cookieStore = await cookies();
    const authToken = cookieStore.get("hok_auth_token")?.value;
    const shopifyToken = cookieStore.get("shopify_customer_token")?.value;

    if (!authToken && !shopifyToken) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to write a review.",
          code: "NOT_LOGGED_IN",
        },
        { status: 401 }
      );
    }

    let customerEmail: string | null = null;
    let customerName: string | null = null;
    let shopifyCustomerId: string | null = null;

    // --- Google OAuth user ---
    if (authToken && JWT_SECRET) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = (await jwtVerify(authToken, secret)) as {
          payload: JWTPayload;
        };
        customerEmail = payload.email;
        customerName = payload.name || null;

        // Get Shopify customer ID
        const supabaseUser = await getUserByEmail(customerEmail);
        if (supabaseUser?.shopify_customer_id) {
          shopifyCustomerId = supabaseUser.shopify_customer_id;
        } else {
          shopifyCustomerId = await findCustomerGidByEmail(customerEmail);
        }
      } catch (error) {
        console.error("JWT verification failed:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Your session has expired. Please sign in again.",
            code: "SESSION_EXPIRED",
          },
          { status: 401 }
        );
      }
    }

    // --- Email/password user ---
    if (!customerEmail && shopifyToken) {
      // Frontend should pass the email for email/password users
      if (body.reviewerEmail) {
        customerEmail = body.reviewerEmail;
        const customer = await findCustomerByEmail(body.reviewerEmail);
        if (customer) {
          shopifyCustomerId = customer.id;
          customerName =
            `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
            body.reviewerName ||
            null;
        }
      }
    }

    if (!customerEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not verify your identity. Please sign in again.",
          code: "IDENTITY_ERROR",
        },
        { status: 401 }
      );
    }

    // === STEP 2: VALIDATE REQUIRED FIELDS ===
    const requiredFields = ["productId", "productTitle", "productHandle", "rating", "title", "body"];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // === STEP 3: VERIFY PURCHASE ===
    if (!shopifyCustomerId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "We couldn't find any orders associated with your account. Only verified buyers can write reviews.",
          code: "NO_CUSTOMER_RECORD",
        },
        { status: 403 }
      );
    }

    const purchaseResult = await hasCustomerPurchasedProduct(
      shopifyCustomerId,
      body.productId
    );

    if (!purchaseResult.purchased) {
      return NextResponse.json(
        {
          success: false,
          error: `You can only review products you've purchased. Buy "${body.productTitle}" to share your experience!`,
          code: "NOT_PURCHASED",
        },
        { status: 403 }
      );
    }

    // === STEP 4: SUBMIT REVIEW ===
    const result = await submitReview({
      productId: body.productId,
      productTitle: body.productTitle,
      productHandle: body.productHandle,
      reviewerName: customerName || "Verified Buyer",
      reviewerEmail: customerEmail,
      rating: body.rating,
      title: body.title,
      body: body.body,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        result.message ||
        "Thank you for your review! It will appear after moderation.",
      review: result.review,
      verifiedPurchase: true,
      purchaseInfo: {
        orderName: purchaseResult.orderName,
        orderDate: purchaseResult.orderDate,
      },
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
