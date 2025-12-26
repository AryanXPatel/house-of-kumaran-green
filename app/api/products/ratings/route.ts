// Product Ratings API
// Fetches real ratings from Judge.me for products displayed in lists (bestsellers, etc.)

import { NextRequest, NextResponse } from "next/server";
import { getProductRating } from "@/lib/judgeme";

/**
 * POST /api/products/ratings
 * 
 * Fetch ratings for multiple products at once
 * 
 * Request body:
 * - productIds: Array of Shopify product IDs
 * 
 * Returns:
 * - ratings: Record<productId, { average: number, count: number }>
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const productIds: string[] = body.productIds || [];

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return NextResponse.json(
                { success: false, error: "productIds array is required" },
                { status: 400 }
            );
        }

        // Limit to 20 products per request to prevent abuse
        const limitedIds = productIds.slice(0, 20);

        // Fetch ratings in parallel
        const ratingPromises = limitedIds.map(async (productId) => {
            try {
                const rating = await getProductRating(productId);
                return { productId, rating };
            } catch (error) {
                console.error(`Error fetching rating for ${productId}:`, error);
                return { productId, rating: { average: 0, count: 0 } };
            }
        });

        const results = await Promise.all(ratingPromises);

        // Convert to record format
        const ratings: Record<string, { average: number; count: number }> = {};
        for (const { productId, rating } of results) {
            // Clean the product ID for consistent lookup
            const cleanId = productId.replace("gid://shopify/Product/", "");
            ratings[cleanId] = rating;
            // Also store with original ID
            ratings[productId] = rating;
        }

        return NextResponse.json({
            success: true,
            ratings,
        });
    } catch (error) {
        console.error("Error fetching product ratings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch ratings" },
            { status: 500 }
        );
    }
}
