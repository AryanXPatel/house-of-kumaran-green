"use client";

import type React from "react";

import type { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useState } from "react";

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

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0d1f14]/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#0d1f14]"
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
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-4 h-4 fill-[#b8860b] text-[#b8860b]" />
            <span className="text-sm font-semibold text-[#f5f0e1]">
              {product.rating}
            </span>
            <span className="text-sm text-[#f5f0e1]/40">
              ({product.reviews})
            </span>
          </div>

          {/* Name & Weight */}
          <h3 className="font-serif text-lg font-bold text-[#f5f0e1] mb-1 group-hover:text-[#b8860b] transition-colors">
            {product.name}
          </h3>
          <p className="text-[#f5f0e1]/50 text-sm mb-4">{product.weight}</p>

          {/* Price & Add to cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#f5f0e1]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#f5f0e1]/40 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                product.inStock
                  ? isAdding
                    ? "bg-green-500 scale-110"
                    : "bg-[#b8860b] hover:bg-[#f5f0e1] hover:scale-110"
                  : "bg-[#f5f0e1]/20 cursor-not-allowed"
              }`}
            >
              <ShoppingBag
                className={`w-5 h-5 ${
                  isAdding ? "text-white" : "text-[#0d1f14]"
                }`}
              />
            </button>
          </div>

          {!product.inStock && (
            <p className="text-red-400 text-sm mt-2">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
