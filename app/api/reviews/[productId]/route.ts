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

    // Use rating data from the count endpoint
    let averageRating = ratingData.average;
    let totalReviews = ratingData.count;

    // If the count endpoint didn't return proper data, we need to calculate from reviews
    // (fallback for Judge.me API issues with external_id)
    if (averageRating === 0 || totalReviews === 0) {
      // If we already have enough reviews in this request, use them
      if (reviewsData.reviews.length > 0 && reviewsData.reviews.length >= perPage) {
        // We might not have all reviews, fetch more to get accurate count
        const allReviewsData = await fetchProductReviews(productId, 1, 100);
        if (allReviewsData.reviews.length > 0) {
          const sum = allReviewsData.reviews.reduce((acc, r) => acc + r.rating, 0);
          averageRating = Math.round((sum / allReviewsData.reviews.length) * 100) / 100;
          totalReviews = allReviewsData.reviews.length;
        }
      } else if (reviewsData.reviews.length > 0) {
        // We have all the reviews (less than perPage), calculate from them
        const sum = reviewsData.reviews.reduce((acc, r) => acc + r.rating, 0);
        averageRating = Math.round((sum / reviewsData.reviews.length) * 100) / 100;
        totalReviews = reviewsData.reviews.length;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews: reviewsData.reviews,
        currentPage: reviewsData.currentPage,
        perPage: reviewsData.perPage,
        averageRating: averageRating,
        totalReviews: totalReviews,
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
