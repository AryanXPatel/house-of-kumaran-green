/**
 * Judge.me Product Reviews Integration
 *
 * This service handles fetching and submitting product reviews via Judge.me API.
 * Judge.me is a popular Shopify reviews app that supports headless/external integrations.
 *
 * API Documentation: https://judge.me/api/docs
 * Note: Headless integration requires the Judge.me "Awesome" paid plan
 */

// Environment variables
const SHOP_DOMAIN = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN || "";
const PRIVATE_API_TOKEN = process.env.JUDGEME_PRIVATE_API_TOKEN || "";
const PUBLIC_API_TOKEN = process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_API_TOKEN || "";

// API endpoints
const API_BASE_URL = "https://judge.me/api/v1";
const REVIEW_SUBMIT_URL = "https://judge.me/reviews"; // Different endpoint for submitting reviews

// Type definitions for Judge.me API responses
export interface JudgeMeReviewer {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  accepts_marketing: boolean;
  unsubscribed_at: string | null;
}

export interface JudgeMeReview {
  id: number;
  title: string;
  body: string;
  rating: number;
  product_external_id: number;
  reviewer: JudgeMeReviewer;
  source: string;
  curated: string;
  published: boolean | string;
  hidden: boolean | string;
  verified: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  has_published_pictures: boolean;
  has_published_videos: boolean;
  pictures: JudgeMePicture[];
  ip_address: string | null;
  product_title: string;
  product_handle: string;
}

export interface JudgeMePicture {
  id: number;
  urls: {
    original: string;
    small: string;
    compact: string;
    huge: string;
  };
}

export interface JudgeMeReviewsResponse {
  reviews: JudgeMeReview[];
  current_page: number;
  per_page: number;
}

export interface JudgeMeProductRating {
  average: number;
  count: number;
}

export interface CreateReviewData {
  productId: string;
  productTitle: string;
  productHandle: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  title: string;
  body: string;
}

// Simplified review type for frontend use
export interface Review {
  id: number;
  title: string;
  body: string;
  rating: number;
  reviewerName: string;
  reviewerEmail: string;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  pictures: {
    id: number;
    url: string;
    thumbnailUrl: string;
  }[];
  productTitle: string;
}

// Validate environment setup
function validateConfig(): boolean {
  if (!SHOP_DOMAIN) {
    console.warn("Judge.me: NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN not configured");
    return false;
  }
  return true;
}

// Cache for internal product IDs to avoid repeated API calls
const internalIdCache: Record<string, { id: string | null; timestamp: number }> = {};
const INTERNAL_ID_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Get Judge.me's internal product ID from Shopify's external product ID
 * Judge.me requires internal IDs for fetching product-specific reviews
 */
async function getInternalProductId(externalId: string): Promise<string | null> {
  // Check cache first
  const cached = internalIdCache[externalId];
  if (cached && Date.now() - cached.timestamp < INTERNAL_ID_CACHE_DURATION) {
    return cached.id;
  }

  const apiToken = PRIVATE_API_TOKEN || PUBLIC_API_TOKEN;
  if (!apiToken) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      shop_domain: SHOP_DOMAIN,
      api_token: apiToken,
      external_id: externalId,
    });

    const response = await fetch(`${API_BASE_URL}/products/-1?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const internalId = data.product?.id?.toString() || null;

      // Cache the result
      internalIdCache[externalId] = {
        id: internalId,
        timestamp: Date.now(),
      };

      return internalId;
    }
  } catch (error) {
    console.error("Error fetching internal product ID:", error);
  }

  // Cache null result to avoid repeated failed requests
  internalIdCache[externalId] = {
    id: null,
    timestamp: Date.now(),
  };

  return null;
}

/**
 * Fetch reviews for a specific product
 * Uses private API token for server-side calls
 *
 * @param productId - The Shopify product ID (external_id for Judge.me)
 * @param page - Page number for pagination (default: 1)
 * @param perPage - Number of reviews per page (default: 10)
 */
export async function fetchProductReviews(
  productId: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ reviews: Review[]; currentPage: number; perPage: number }> {
  if (!validateConfig()) {
    return { reviews: [], currentPage: 1, perPage: 10 };
  }

  // Use private token for server-side, fall back to public
  const apiToken = PRIVATE_API_TOKEN || PUBLIC_API_TOKEN;
  if (!apiToken) {
    console.warn("Judge.me: No API token configured");
    return { reviews: [], currentPage: 1, perPage: 10 };
  }

  try {
    // Clean the product ID (remove Shopify GID prefix if present)
    const cleanProductId = productId.replace("gid://shopify/Product/", "");

    // Get Judge.me's internal product ID (required for fetching product-specific reviews)
    const internalProductId = await getInternalProductId(cleanProductId);

    if (!internalProductId) {
      // Product doesn't exist in Judge.me yet - no reviews
      return { reviews: [], currentPage: 1, perPage: 10 };
    }

    // Use product_id (internal ID) instead of external_id for the reviews endpoint
    const params = new URLSearchParams({
      shop_domain: SHOP_DOMAIN,
      api_token: apiToken,
      product_id: internalProductId,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/reviews?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Judge.me API error:", response.status, errorText);
      throw new Error(`Judge.me API error: ${response.status}`);
    }

    const data: JudgeMeReviewsResponse = await response.json();

    // Handle case where reviews might be empty or undefined
    if (!data.reviews || !Array.isArray(data.reviews)) {
      return { reviews: [], currentPage: 1, perPage: 10 };
    }

    // Filter out hidden and unpublished reviews
    // Judge.me API may return these as booleans or strings
    const visibleReviews = data.reviews.filter((review) => {
      // Handle both boolean and string values from API
      const isPublished = review.published === true || String(review.published) === "true";
      const isHidden = review.hidden === true || String(review.hidden) === "true";
      const isCurated = review.curated;

      // Show only published, non-hidden reviews
      // curated can be: "ok", "spam", etc. - only show "ok" or non-spam
      const isNotSpam = !isCurated || isCurated === "ok" || isCurated === "approved";

      return isPublished && !isHidden && isNotSpam;
    });

    // Transform to simplified format
    const reviews: Review[] = visibleReviews.map((review) => ({
      id: review.id,
      title: review.title || "",
      body: review.body || "",
      rating: review.rating,
      reviewerName: review.reviewer?.name || "Anonymous",
      reviewerEmail: review.reviewer?.email || "",
      verified: review.verified === "verified-buyer",
      featured: review.featured || false,
      createdAt: review.created_at,
      pictures: (review.pictures || []).map((pic) => ({
        id: pic.id,
        url: pic.urls?.original || "",
        thumbnailUrl: pic.urls?.compact || "",
      })),
      productTitle: review.product_title || "",
    }));

    return {
      reviews,
      currentPage: data.current_page || 1,
      perPage: data.per_page || 10,
    };
  } catch (error) {
    console.error("Error fetching Judge.me reviews:", error);
    return { reviews: [], currentPage: 1, perPage: 10 };
  }
}

/**
 * Get average rating and review count for a product
 * Uses private API token for server-side calls
 *
 * @param productId - The Shopify product ID
 */
export async function getProductRating(
  productId: string
): Promise<JudgeMeProductRating> {
  if (!validateConfig()) {
    return { average: 0, count: 0 };
  }

  try {
    // Instead of using Judge.me's count endpoint (which includes hidden reviews),
    // fetch the actual visible reviews and calculate the rating from them
    const { reviews } = await fetchProductReviews(productId, 1, 100);

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    // Calculate average from visible reviews only
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal

    return {
      average,
      count: reviews.length,
    };
  } catch (error) {
    console.error("Error fetching product rating:", error);
    return { average: 0, count: 0 };
  }
}

/**
 * Submit a new review using the authenticated API v1 endpoint
 * This ensures the reviewer name is properly set (public endpoint uses existing reviewer profiles)
 *
 * @param reviewData - The review data to submit
 */
export async function submitReview(
  reviewData: CreateReviewData
): Promise<{
  success: boolean;
  error?: string;
  review?: Review;
  message?: string;
}> {
  if (!SHOP_DOMAIN) {
    return { success: false, error: "Judge.me shop domain not configured" };
  }

  if (!PRIVATE_API_TOKEN) {
    return {
      success: false,
      error: "Judge.me private API token not configured",
    };
  }

  try {
    const cleanProductId = reviewData.productId.replace(
      "gid://shopify/Product/",
      ""
    );

    // First, get the internal Judge.me product ID from the external (Shopify) ID
    const productResponse = await fetch(
      `${API_BASE_URL}/products/-1?shop_domain=${SHOP_DOMAIN}&api_token=${PRIVATE_API_TOKEN}&external_id=${cleanProductId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let internalProductId: string | null = null;
    if (productResponse.ok) {
      const productData = await productResponse.json();
      if (productData.product && productData.product.id) {
        internalProductId = String(productData.product.id);
      }
    }

    console.log("Judge.me internal product ID:", internalProductId);

    // Build the review payload for the authenticated API
    const reviewPayload = {
      shop_domain: SHOP_DOMAIN,
      api_token: PRIVATE_API_TOKEN,
      platform: "shopify",
      // Use internal product ID if available, otherwise use external ID
      ...(internalProductId
        ? { id: internalProductId }
        : { external_id: cleanProductId }),
      reviewer: {
        name: reviewData.reviewerName,
        email: reviewData.reviewerEmail,
      },
      review: {
        rating: reviewData.rating,
        title: reviewData.title,
        body: reviewData.body,
      },
      product_title: reviewData.productTitle,
      handle: reviewData.productHandle,
    };

    console.log("Submitting review to Judge.me API v1:", {
      shop_domain: SHOP_DOMAIN,
      product_id: internalProductId || cleanProductId,
      reviewer_name: reviewData.reviewerName,
      reviewer_email: reviewData.reviewerEmail,
      rating: reviewData.rating,
      title: reviewData.title,
    });

    // Try the authenticated API v1 endpoint first
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewPayload),
    });

    const responseText = await response.text();
    console.log(
      "Judge.me API v1 submit response:",
      response.status,
      responseText
    );

    // If API v1 fails (e.g., endpoint not available), fall back to public endpoint
    if (response.status === 404 || response.status === 405) {
      console.log("Falling back to public endpoint...");
      return submitReviewPublic(reviewData, cleanProductId);
    }

    // Try to parse the response as JSON
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(responseText);
    } catch {
      // Not JSON, check if it's an error
      if (
        responseText.toLowerCase().includes("error") ||
        responseText.toLowerCase().includes("invalid")
      ) {
        return {
          success: false,
          error:
            "Failed to submit review. Please check your input and try again.",
        };
      }
      // If 200/201 and not JSON but no error keywords, treat as success
      if (response.ok) {
        return {
          success: true,
          message: "Review submitted successfully!",
          review: createPendingReview(reviewData),
        };
      }
      // Fall back to public endpoint
      return submitReviewPublic(reviewData, cleanProductId);
    }

    // Check for explicit error in response
    if (data.error) {
      // If API v1 has issues, try public endpoint
      console.log("API v1 returned error, falling back to public endpoint...");
      return submitReviewPublic(reviewData, cleanProductId);
    }

    // SUCCESS CASES for API v1:

    // Case 1: Review object returned directly
    if (data.review && typeof data.review === "object") {
      const review = data.review as Record<string, unknown>;
      return {
        success: true,
        message: "Review submitted successfully!",
        review: {
          id: Number(review.id) || 0,
          title: String(review.title || reviewData.title),
          body: String(review.body || reviewData.body),
          rating: Number(review.rating) || reviewData.rating,
          reviewerName: reviewData.reviewerName, // Use submitted name
          reviewerEmail: "",
          verified: false,
          featured: false,
          createdAt: String(review.created_at || new Date().toISOString()),
          pictures: [],
          productTitle: String(review.product_title || reviewData.productTitle),
        },
      };
    }

    // Case 2: Background processing message
    if (data.message && typeof data.message === "string") {
      const message = data.message.toLowerCase();
      if (
        message.includes("processed") ||
        message.includes("created") ||
        message.includes("success") ||
        message.includes("submitted") ||
        message.includes("background")
      ) {
        return {
          success: true,
          message:
            "Review submitted successfully! It will appear after moderation.",
          review: createPendingReview(reviewData),
        };
      }
    }

    // Case 3: Success status or ID returned
    if (data.success === true || data.status === "success" || data.id) {
      return {
        success: true,
        message: "Review submitted successfully!",
        review: createPendingReview(reviewData),
      };
    }

    // Case 4: 200/201 response - assume success
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: "Review submitted! It will appear after processing.",
        review: createPendingReview(reviewData),
      };
    }

    // If API v1 didn't work as expected, try public endpoint
    return submitReviewPublic(reviewData, cleanProductId);
  } catch (error) {
    console.error("Error submitting review via API v1:", error);
    // Try public endpoint as last resort
    try {
      const cleanProductId = reviewData.productId.replace(
        "gid://shopify/Product/",
        ""
      );
      return submitReviewPublic(reviewData, cleanProductId);
    } catch (fallbackError) {
      console.error(
        "Error submitting review via public endpoint:",
        fallbackError
      );
      return {
        success: false,
        error: "Failed to submit review. Please try again.",
      };
    }
  }
}

/**
 * Fallback: Submit review via public endpoint
 * Note: This endpoint may use existing reviewer profiles, so the name might not match
 */
async function submitReviewPublic(
  reviewData: CreateReviewData,
  cleanProductId: string
): Promise<{
  success: boolean;
  error?: string;
  review?: Review;
  message?: string;
}> {
  // Use FormData for the review submission endpoint
  const formData = new URLSearchParams();
  formData.append("shop_domain", SHOP_DOMAIN);
  formData.append("platform", "shopify");
  formData.append("id", cleanProductId);
  formData.append(
    "url",
    `https://${SHOP_DOMAIN.replace(".myshopify.com", ".com")}`
  );
  formData.append("name", reviewData.reviewerName);
  formData.append("email", reviewData.reviewerEmail);
  formData.append("rating", reviewData.rating.toString());
  formData.append("title", reviewData.title);
  formData.append("body", reviewData.body);

  // Optional parameters
  if (reviewData.productTitle) {
    formData.append("product_title", reviewData.productTitle);
  }
  if (reviewData.productHandle) {
    formData.append("handle", reviewData.productHandle);
  }

  console.log("Submitting review via public endpoint:", {
    shop_domain: SHOP_DOMAIN,
    id: cleanProductId,
    name: reviewData.reviewerName,
    email: reviewData.reviewerEmail,
  });

  const response = await fetch(REVIEW_SUBMIT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const responseText = await response.text();
  console.log(
    "Judge.me public endpoint response:",
    response.status,
    responseText
  );

  // Try to parse the response as JSON
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(responseText);
  } catch {
    if (response.ok) {
      return {
        success: true,
        message: "Review submitted successfully!",
        review: createPendingReview(reviewData),
      };
    }
    return { success: false, error: "Unexpected response from Judge.me" };
  }

  // Check for explicit error
  if (data.error) {
    return { success: false, error: String(data.error) };
  }

  // Background processing message
  if (data.message && typeof data.message === "string") {
    const message = data.message.toLowerCase();
    if (
      message.includes("processed") ||
      message.includes("created") ||
      message.includes("success") ||
      message.includes("background")
    ) {
      return {
        success: true,
        message:
          "Review submitted successfully! It will appear after moderation.",
        review: createPendingReview(reviewData),
      };
    }
  }

  // Assume success for 200/201
  if (response.ok) {
    return {
      success: true,
      message: "Review submitted! It will appear after processing.",
      review: createPendingReview(reviewData),
    };
  }

  return {
    success: false,
    error: "Unable to submit review. Please try again.",
  };
}

/**
 * Helper to create a pending review object from submitted data
 */
function createPendingReview(reviewData: CreateReviewData): Review {
  return {
    id: 0,
    title: reviewData.title,
    body: reviewData.body,
    rating: reviewData.rating,
    reviewerName: reviewData.reviewerName,
    reviewerEmail: "",
    verified: false,
    featured: false,
    createdAt: new Date().toISOString(),
    pictures: [],
    productTitle: reviewData.productTitle,
  };
}

/**
 * Get widget embed script URL for Judge.me
 * This is useful for embedding Judge.me's pre-built widgets
 */
export function getWidgetScriptUrl(): string {
  return `https://cdn.judge.me/widget_preloader.js`;
}

/**
 * Get widget initialization data attributes
 * These should be added to the container div for the review widget
 */
export function getWidgetAttributes(
  productId: string,
  productHandle: string,
  productTitle: string
): Record<string, string> {
  const cleanProductId = productId.replace("gid://shopify/Product/", "");

  return {
    "data-product-id": cleanProductId,
    "data-product-title": productTitle,
    "data-product-url": `/product/${productHandle}`,
    "data-shop-domain": SHOP_DOMAIN,
  };
}

/**
 * Format a date string for display
 */
export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate rating distribution from reviews
 */
export function calculateRatingDistribution(
  reviews: Review[]
): Record<number, number> {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });

  return distribution;
}
