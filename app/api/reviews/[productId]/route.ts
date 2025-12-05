import { NextRequest, NextResponse } from "next/server";
import { fetchProductReviews, getProductRating } from "@/lib/judgeme";

/**
 * GET /api/reviews/[productId]
 * Fetch reviews for a specific product from Judge.me
 *
 * Query params:
 * - page: Page number (default: 1)
 * - perPage: Number of reviews per page (default: 10)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "10", 10);

    // Fetch reviews and rating in parallel
    const [reviewsData, ratingData] = await Promise.all([
      fetchProductReviews(productId, page, perPage),
      getProductRating(productId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        reviews: reviewsData.reviews,
        currentPage: reviewsData.currentPage,
        perPage: reviewsData.perPage,
        averageRating: ratingData.average,
        totalReviews: ratingData.count,
      },
    });
  } catch (error) {
    console.error("Error in reviews API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
