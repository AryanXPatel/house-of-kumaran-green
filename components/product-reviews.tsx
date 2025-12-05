"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ThumbsUp, CheckCircle, Filter, ChevronDown } from "lucide-react";
import type { Review } from "@/lib/judgeme";

interface ProductReviewsProps {
  productId: string;
  productTitle: string;
  productHandle: string;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export function ProductReviews({
  productId,
  productTitle,
  productHandle,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const perPage = 5;

  useEffect(() => {
    fetchReviews();
  }, [productId, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/reviews/${encodeURIComponent(
          productId
        )}?page=${currentPage}&perPage=${perPage}`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setAverageRating(data.data.averageRating);
        setTotalReviews(data.data.totalReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Sort and filter reviews
  const sortedReviews = [...reviews]
    .filter((review) => !filterRating || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "fill-[#b8860b] text-[#b8860b]"
                : "text-[#f5f0e1]/20"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <section className="py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[#1a472a]/30 rounded w-1/4"></div>
            <div className="h-32 bg-[#1a472a]/30 rounded"></div>
            <div className="h-32 bg-[#1a472a]/30 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 border-t border-[#b8860b]/10">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold">
            Customer Reviews
          </h2>
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-3 bg-[#b8860b] hover:bg-[#f5f0e1] text-[#0d1f14] font-bold rounded-full transition-all"
          >
            Write a Review
          </button>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 p-6 bg-[#1a472a]/30 rounded-2xl">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold text-[#b8860b] mb-2">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating), "lg")}
            <p className="text-[#f5f0e1]/70 mt-2">
              Based on {totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <button
                  key={rating}
                  onClick={() =>
                    setFilterRating(filterRating === rating ? null : rating)
                  }
                  className={`flex items-center gap-3 w-full group transition-all ${
                    filterRating === rating
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className="w-8 text-sm font-medium">{rating} star</span>
                  <div className="flex-1 h-3 bg-[#0d1f14]/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#b8860b] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-[#f5f0e1]/70 text-right">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-[#f5f0e1]/70">
              {sortedReviews.length} reviews
              {filterRating && ` (${filterRating} star)`}
            </span>
            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="text-sm text-[#b8860b] hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-[#b8860b]/20 rounded-lg hover:border-[#b8860b] transition-all"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">
                Sort by:{" "}
                {sortBy === "newest"
                  ? "Newest"
                  : sortBy === "oldest"
                  ? "Oldest"
                  : sortBy === "highest"
                  ? "Highest Rating"
                  : "Lowest Rating"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0d1f14] border border-[#b8860b]/20 rounded-lg shadow-xl z-10">
                {(
                  ["newest", "oldest", "highest", "lowest"] as SortOption[]
                ).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#1a472a]/50 first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option ? "text-[#b8860b]" : ""
                    }`}
                  >
                    {option === "newest"
                      ? "Newest First"
                      : option === "oldest"
                      ? "Oldest First"
                      : option === "highest"
                      ? "Highest Rating"
                      : "Lowest Rating"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        {sortedReviews.length === 0 ? (
          <div className="text-center py-12 bg-[#1a472a]/20 rounded-2xl">
            <p className="text-[#f5f0e1]/70 mb-4">
              {filterRating
                ? `No ${filterRating}-star reviews yet.`
                : "No reviews yet. Be the first to share your experience!"}
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-[#b8860b] hover:bg-[#f5f0e1] text-[#0d1f14] font-bold rounded-full transition-all"
            >
              Write a Review
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10"
              >
                {/* Review Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold">
                        {review.reviewerName}
                      </span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Verified Purchase
                        </span>
                      )}
                      {review.featured && (
                        <span className="text-xs text-[#b8860b] bg-[#b8860b]/10 px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-[#f5f0e1]/50">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                {/* Review Content */}
                {review.title && (
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                )}
                <p className="text-[#f5f0e1]/80 leading-relaxed">
                  {review.body}
                </p>

                {/* Review Images */}
                {review.pictures && review.pictures.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {review.pictures.map((picture) => (
                      <div
                        key={picture.id}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#b8860b]/20"
                      >
                        <Image
                          src={picture.thumbnailUrl}
                          alt="Review image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#b8860b]/10">
                  <button className="flex items-center gap-2 text-sm text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalReviews > perPage && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#b8860b]/20 rounded-lg hover:border-[#b8860b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-[#f5f0e1]/70">
              Page {currentPage} of {Math.ceil(totalReviews / perPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(Math.ceil(totalReviews / perPage), p + 1)
                )
              }
              disabled={currentPage >= Math.ceil(totalReviews / perPage)}
              className="px-4 py-2 border border-[#b8860b]/20 rounded-lg hover:border-[#b8860b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewFormModal
            productId={productId}
            productTitle={productTitle}
            productHandle={productHandle}
            onClose={() => setShowReviewForm(false)}
            onSuccess={() => {
              setShowReviewForm(false);
              fetchReviews();
            }}
          />
        )}
      </div>
    </section>
  );
}

// Review Form Modal Component
interface ReviewFormModalProps {
  productId: string;
  productTitle: string;
  productHandle: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ReviewFormModal({
  productId,
  productTitle,
  productHandle,
  onClose,
  onSuccess,
}: ReviewFormModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productTitle,
          productHandle,
          reviewerName: name,
          reviewerEmail: email,
          rating,
          title,
          body,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to submit review");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1f14] border border-[#b8860b]/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Write a Review</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1a472a]/50 rounded-full transition-colors"
            >
              ×
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Thank You!</h4>
              <p className="text-[#f5f0e1]/70">
                Your review has been submitted and will appear after moderation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Info */}
              <div className="text-center pb-4 border-b border-[#b8860b]/10">
                <p className="text-[#f5f0e1]/70 text-sm">
                  You&apos;re reviewing
                </p>
                <p className="font-semibold">{productTitle}</p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Rating *
                </label>
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? "fill-[#b8860b] text-[#b8860b]"
                            : "text-[#f5f0e1]/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Review Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your review a title"
                  required
                  className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/20 rounded-lg focus:border-[#b8860b] focus:outline-none transition-colors"
                />
              </div>

              {/* Review Body */}
              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium mb-2"
                >
                  Your Review *
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your review here..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/20 rounded-lg focus:border-[#b8860b] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/20 rounded-lg focus:border-[#b8860b] focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/20 rounded-lg focus:border-[#b8860b] focus:outline-none transition-colors"
                />
                <p className="text-xs text-[#f5f0e1]/50 mt-1">
                  Your email will not be published
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#b8860b] hover:bg-[#f5f0e1] text-[#0d1f14] font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
