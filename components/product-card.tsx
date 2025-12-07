"use client";

import type React from "react";

import type { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useState } from "react";
import { StarRatingBadge } from "./star-rating-badge";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useShopifyCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const isWishlisted = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative bg-[#1a472a]/30 rounded-2xl overflow-hidden border border-[#b8860b]/10 hover:border-[#b8860b]/30 transition-all duration-500">
        {/* Tags */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isBestseller && (
            <span className="px-3 py-1 bg-[#b8860b] text-[#0d1f14] text-xs font-bold rounded-full">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1 bg-[#f5f0e1] text-[#0d1f14] text-xs font-bold rounded-full">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist - Always visible on mobile, hover on desktop */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-[#0d1f14] ${
            isWishlisted
              ? "opacity-100 bg-red-500/20"
              : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-[#0d1f14]/50"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#f5f0e1]"
            }`}
          />
        </button>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5">
          {/* Rating - Shows Judge.me reviews if available, falls back to default */}
          {product.shopifyId ? (
            <div className="mb-1.5 sm:mb-2 min-h-4 sm:min-h-5">
              <StarRatingBadge
                productId={product.shopifyId}
                size="sm"
                showCount={true}
              />
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#b8860b] text-[#b8860b]" />
              <span className="text-xs sm:text-sm font-semibold text-[#f5f0e1]">
                {product.rating}
              </span>
              <span className="text-xs sm:text-sm text-[#f5f0e1]/40">
                ({product.reviews})
              </span>
            </div>
          )}

          {/* Name & Weight */}
          <h3 className="font-serif text-sm sm:text-lg font-bold text-[#f5f0e1] mb-0.5 sm:mb-1 group-hover:text-[#b8860b] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[#f5f0e1]/50 text-xs sm:text-sm mb-2 sm:mb-4">
            {product.weight}
          </p>

          {/* Price & Add to cart */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-bold text-[#f5f0e1]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-[#f5f0e1]/40 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg font-semibold text-sm ${
                product.inStock
                  ? isAdding
                    ? "bg-green-500 scale-105 sm:scale-110"
                    : "bg-[#b8860b] hover:bg-[#d4a017] sm:hover:scale-110 active:scale-95"
                  : "bg-[#f5f0e1]/20 cursor-not-allowed"
              }`}
            >
              <ShoppingBag
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isAdding ? "text-white" : "text-[#0d1f14]"
                }`}
              />
              <span className="sm:hidden text-[#0d1f14]">
                {product.inStock
                  ? isAdding
                    ? "Added!"
                    : "Add to Cart"
                  : "Out of Stock"}
              </span>
            </button>
          </div>

          {!product.inStock && (
            <p className="text-red-400 text-xs sm:text-sm mt-1.5 sm:mt-2 hidden sm:block">
              Out of Stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
