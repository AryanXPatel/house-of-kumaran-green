"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface StarRatingBadgeProps {
  productId: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

interface RatingData {
  average: number;
  count: number;
}

// Cache for rating data to avoid repeated API calls
const ratingCache: Record<string, { data: RatingData; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function StarRatingBadge({
  productId,
  size = "sm",
  showCount = true,
  className = "",
}: StarRatingBadgeProps) {
  const [rating, setRating] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      // Check cache first
      const cached = ratingCache[productId];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setRating(cached.data);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/reviews/${encodeURIComponent(productId)}?perPage=1`
        );
        const data = await response.json();

        if (data.success) {
          const ratingData = {
            average: data.data.averageRating || 0,
            count: data.data.totalReviews || 0,
          };

          // Update cache
          ratingCache[productId] = {
            data: ratingData,
            timestamp: Date.now(),
          };

          setRating(ratingData);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [productId]);

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Show loading skeleton
  if (loading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="animate-pulse h-3 w-16 bg-[#f5f0e1]/10 rounded" />
      </div>
    );
  }

  // Show "Be the first to review" when no reviews
  if (!rating || rating.count === 0) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`${sizeClasses[size]} text-[#f5f0e1]/20`}
            />
          ))}
        </div>
        <span className={`text-[#b8860b] ${textSizeClasses[size]}`}>
          Be the first to review
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating.average)
                ? "fill-[#b8860b] text-[#b8860b]"
                : "text-[#f5f0e1]/20"
            }`}
          />
        ))}
      </div>

      {/* Count */}
      {showCount && (
        <span className={`text-[#f5f0e1]/60 ${textSizeClasses[size]}`}>
          ({rating.count})
        </span>
      )}
    </div>
  );
}

// Inline version for product cards that shows rating without API call
// Use this when you already have rating data
interface InlineStarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function InlineStarRating({
  rating,
  count = 0,
  size = "sm",
  showCount = true,
  className = "",
}: InlineStarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (rating === 0 && count === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating)
                ? "fill-[#b8860b] text-[#b8860b]"
                : "text-[#f5f0e1]/20"
            }`}
          />
        ))}
      </div>

      {/* Count */}
      {showCount && count > 0 && (
        <span className={`text-[#f5f0e1]/60 ${textSizeClasses[size]}`}>
          ({count})
        </span>
      )}
    </div>
  );
}
