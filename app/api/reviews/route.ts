import { NextRequest, NextResponse } from "next/server";
import { submitReview } from "@/lib/judgeme";

/**
 * POST /api/reviews
 * Submit a new product review to Judge.me
 *
 * Request body:
 * - productId: Shopify product ID
 * - productTitle: Product title
 * - productHandle: Product handle/slug
 * - reviewerName: Reviewer's name
 * - reviewerEmail: Reviewer's email
 * - rating: Rating (1-5)
 * - title: Review title
 * - body: Review body/content
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "productId",
      "productTitle",
      "productHandle",
      "reviewerName",
      "reviewerEmail",
      "rating",
      "title",
      "body",
    ];

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.reviewerEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Submit review to Judge.me
    const result = await submitReview({
      productId: body.productId,
      productTitle: body.productTitle,
      productHandle: body.productHandle,
      reviewerName: body.reviewerName,
      reviewerEmail: body.reviewerEmail,
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
        "Review submitted successfully! It will appear after moderation.",
      review: result.review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
