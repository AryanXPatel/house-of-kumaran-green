// Verify if logged-in customer has purchased a specific product
// Used to gate review writing to verified buyers only

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
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
    picture?: string;
}

/**
 * GET /api/reviews/verify-purchase?productId=xxx
 *
 * Checks if the logged-in user has purchased the specified product.
 * Supports both Google OAuth (JWT cookie) and email/password auth.
 *
 * Returns:
 * - canReview: true/false
 * - reason: "NOT_LOGGED_IN" | "NOT_PURCHASED" | "ELIGIBLE"
 * - customerName: pre-filled for review form
 * - customerEmail: pre-filled for review form (masked)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Check for auth cookies
        const cookieStore = await cookies();
        const authToken = cookieStore.get("hok_auth_token")?.value;
        const shopifyToken = cookieStore.get("shopify_customer_token")?.value;

        // --- CASE 1: Not logged in at all ---
        if (!authToken && !shopifyToken) {
            return NextResponse.json({
                success: true,
                canReview: false,
                reason: "NOT_LOGGED_IN",
                message:
                    "Please sign in to write a review. Only customers who have purchased this product can share their experience.",
            });
        }

        let customerEmail: string | null = null;
        let customerName: string | null = null;
        let shopifyCustomerId: string | null = null;

        // --- CASE 2: Google OAuth user (JWT token) ---
        if (authToken && JWT_SECRET) {
            try {
                const secret = new TextEncoder().encode(JWT_SECRET);
                const { payload } = (await jwtVerify(authToken, secret)) as {
                    payload: JWTPayload;
                };
                customerEmail = payload.email;
                customerName = payload.name || null;

                // Get Shopify customer ID from Supabase
                const supabaseUser = await getUserByEmail(customerEmail);
                if (supabaseUser?.shopify_customer_id) {
                    shopifyCustomerId = supabaseUser.shopify_customer_id;
                } else {
                    // Try to find customer by email in Shopify
                    shopifyCustomerId = await findCustomerGidByEmail(customerEmail);
                }
            } catch (error) {
                console.error("JWT verification failed:", error);
                return NextResponse.json({
                    success: true,
                    canReview: false,
                    reason: "NOT_LOGGED_IN",
                    message: "Your session has expired. Please sign in again.",
                });
            }
        }

        // --- CASE 3: Email/password user (Shopify token) ---
        if (!customerEmail && shopifyToken) {
            // For email/password users, we need to get their email from Shopify Storefront API
            // They should have their info stored in localStorage, which the frontend sends
            // For now, we'll check if they provided email as a query param
            const emailParam = searchParams.get("email");
            if (emailParam) {
                customerEmail = emailParam;
                // Find the Shopify customer
                const customer = await findCustomerByEmail(emailParam);
                if (customer) {
                    shopifyCustomerId = customer.id;
                    customerName =
                        `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
                        null;
                }
            } else {
                // Fallback: they're logged in but we can't verify purchase without email
                return NextResponse.json({
                    success: true,
                    canReview: false,
                    reason: "NEEDS_EMAIL",
                    message: "Please provide your email to verify your purchase.",
                });
            }
        }

        // --- CHECK: No Shopify customer found ---
        if (!shopifyCustomerId) {
            return NextResponse.json({
                success: true,
                canReview: false,
                reason: "NOT_PURCHASED",
                message:
                    "We couldn't find any orders associated with your account. Only verified buyers can write reviews.",
            });
        }

        // --- VERIFY PURCHASE ---
        const purchaseResult = await hasCustomerPurchasedProduct(
            shopifyCustomerId,
            productId
        );

        if (!purchaseResult.purchased) {
            return NextResponse.json({
                success: true,
                canReview: false,
                reason: "NOT_PURCHASED",
                message:
                    "You can only review products you've purchased. Get this product to share your experience!",
            });
        }

        // --- SUCCESS: Customer is eligible to review ---
        return NextResponse.json({
            success: true,
            canReview: true,
            reason: "ELIGIBLE",
            customerName: customerName || "Verified Buyer",
            customerEmail: customerEmail,
            maskedEmail: maskEmail(customerEmail || ""),
            orderInfo: {
                orderName: purchaseResult.orderName,
                orderDate: purchaseResult.orderDate,
            },
            message: "You're eligible to write a review for this product!",
        });
    } catch (error) {
        console.error("Verify purchase error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to verify purchase eligibility" },
            { status: 500 }
        );
    }
}

/**
 * Mask email for privacy (a***n@gmail.com)
 */
function maskEmail(email: string): string {
    if (!email || !email.includes("@")) return email;

    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
        return `${localPart[0]}***@${domain}`;
    }

    return `${localPart[0]}${"*".repeat(Math.min(localPart.length - 2, 3))}${localPart[localPart.length - 1]
        }@${domain}`;
}
