"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Droplets,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useRecentlyViewed } from "@/lib/recently-viewed-context";
import { StarRatingBadge } from "./star-rating-badge";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useShopifyCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const isWishlisted = isInWishlist(product.id);
  const images = product.images || [product.image];
  const isComingSoon = product.tags.some(
    (tag) => tag.toLowerCase() === "coming-soon"
  );
  const discount = product.originalPrice
    ? Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    )
    : 0;

  // Track product view
  useEffect(() => {
    addToRecentlyViewed(product);
  }, [product, addToRecentlyViewed]);

  const handleAddToCart = () => {
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 800);
  };

  const goToPreviousImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextImage = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      if (e.key === "ArrowLeft") {
        goToPreviousImage();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedImage < images.length - 1) {
      goToNextImage();
    }
    if (isRightSwipe && selectedImage > 0) {
      goToPreviousImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }, [selectedImage, images.length]);

  return (
    <section className="py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-[#1a472a]/30 border border-[#b8860b]/10"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex flex-col gap-1.5 sm:gap-2">
                {isComingSoon && (
                  <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-amber-500/90 backdrop-blur-sm text-[#0d1f14] text-[10px] sm:text-sm font-bold rounded-full uppercase tracking-wide">
                    Coming Soon
                  </span>
                )}
                {product.isBestseller && !isComingSoon && (
                  <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-[#b8860b] text-[#0d1f14] text-[10px] sm:text-sm font-bold rounded-full">
                    Bestseller
                  </span>
                )}
                {product.isNew && !isComingSoon && (
                  <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-[#f5f0e1] text-[#0d1f14] text-[10px] sm:text-sm font-bold rounded-full">
                    New Arrival
                  </span>
                )}
                {discount > 0 && !isComingSoon && (
                  <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-red-500 text-white text-[10px] sm:text-sm font-bold rounded-full">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Heart - Top Right on Image */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 sm:top-6 sm:right-6 w-9 h-9 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all backdrop-blur-sm ${isWishlisted
                    ? "border-red-500 bg-red-500/20"
                    : "border-[#f5f0e1]/30 bg-[#0d1f14]/50 hover:border-[#b8860b] hover:bg-[#0d1f14]/70"
                  }`}
              >
                <Heart
                  className={`w-4 h-4 sm:w-6 sm:h-6 ${isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-[#f5f0e1]"
                    }`}
                />
              </button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={goToPreviousImage}
                    disabled={selectedImage === 0}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-all backdrop-blur-sm ${selectedImage === 0
                        ? "border-[#f5f0e1]/10 bg-[#0d1f14]/30 cursor-not-allowed opacity-40"
                        : "border-[#f5f0e1]/30 bg-[#0d1f14]/50 hover:border-[#b8860b] hover:bg-[#0d1f14]/70"
                      }`}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#f5f0e1]" />
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={goToNextImage}
                    disabled={selectedImage === images.length - 1}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-all backdrop-blur-sm ${selectedImage === images.length - 1
                        ? "border-[#f5f0e1]/10 bg-[#0d1f14]/30 cursor-not-allowed opacity-40"
                        : "border-[#f5f0e1]/30 bg-[#0d1f14]/50 hover:border-[#b8860b] hover:bg-[#0d1f14]/70"
                      }`}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-[#f5f0e1]" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                        ? "border-[#b8860b]"
                        : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Rating - Dynamic from Judge.me */}
            <div className="flex items-center gap-3 mb-4">
              {product.shopifyId ? (
                <StarRatingBadge
                  productId={product.shopifyId}
                  size="lg"
                  showCount={true}
                />
              ) : (
                // Fallback for non-Shopify products
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating)
                            ? "fill-[#b8860b] text-[#b8860b]"
                            : "text-[#f5f0e1]/20"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-[#f5f0e1]/70">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </>
              )}
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-[#b8860b]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg sm:text-xl text-[#f5f0e1]/40 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 text-xs sm:text-sm font-semibold rounded-full">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Weight */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 text-[#f5f0e1]/70 text-sm sm:text-base">
              <span>Net Weight:</span>
              <span className="font-semibold text-[#f5f0e1]">
                {product.weight}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center border border-[#b8860b]/20 rounded-full h-12 sm:h-14 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 sm:w-14 h-full flex items-center justify-center hover:text-[#b8860b] transition-colors"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <span className="w-8 sm:w-12 text-center font-bold text-base sm:text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 sm:w-14 h-full flex items-center justify-center hover:text-[#b8860b] transition-colors"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isComingSoon}
                className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 rounded-full font-bold text-base sm:text-base transition-all duration-300 ${isComingSoon
                    ? "bg-amber-500/90 text-[#0d1f14] cursor-not-allowed"
                    : product.inStock
                      ? isAdding
                        ? "bg-green-500 text-white scale-[1.02]"
                        : "bg-[#b8860b] hover:bg-[#f5f0e1] text-[#0d1f14]"
                      : "bg-[#f5f0e1]/20 text-[#f5f0e1]/40 cursor-not-allowed"
                  }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-6 h-6 sm:w-5 sm:h-5" />
                    Added to Cart!
                  </>
                ) : isComingSoon ? (
                  <>
                    <ShoppingBag className="w-6 h-6 sm:w-5 sm:h-5" />
                    Coming Soon
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-6 h-6 sm:w-5 sm:h-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <div
              className="text-sm sm:text-base text-[#f5f0e1]/70 leading-relaxed mb-6 sm:mb-8 product-description prose prose-invert prose-sm sm:prose-base max-w-none
                [&>h1]:text-lg [&>h1]:sm:text-xl [&>h1]:font-semibold [&>h1]:text-[#f5f0e1] [&>h1]:mb-3 [&>h1]:mt-0
                [&>h2]:text-base [&>h2]:sm:text-lg [&>h2]:font-semibold [&>h2]:text-[#b8860b] [&>h2]:mt-4 [&>h2]:mb-2
                [&>h3]:text-sm [&>h3]:sm:text-base [&>h3]:font-semibold [&>h3]:text-[#b8860b] [&>h3]:mt-3 [&>h3]:mb-2
                [&>p]:text-[#f5f0e1]/70 [&>p]:mb-3 [&>p]:leading-relaxed
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul]:space-y-1
                [&>ul>li]:text-[#f5f0e1]/70
                [&_strong]:font-semibold [&_strong]:text-[#f5f0e1]
                [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: product.longDescription || product.description || '' }}
            />

            {/* Trust Badges - Compact on mobile */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-8">
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#1a472a]/30 rounded-xl">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#b8860b] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    100% Handmade
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#f5f0e1]/50">
                    with love
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#1a472a]/30 rounded-xl">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#b8860b] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    Zero Preservatives
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#f5f0e1]/50">
                    100% natural
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#1a472a]/30 rounded-xl">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-[#b8860b] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    Fresh Batch
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#f5f0e1]/50">
                    fresh oil
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#1a472a]/30 rounded-xl">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#b8860b] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    Free Shipping
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#f5f0e1]/50">
                    above ₹399
                  </p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="border-t border-[#b8860b]/10 pt-8 space-y-6">
              {/* Storage & Shelf Life */}
              <div className="grid grid-cols-2 gap-6">
                {product.shelfLife && (
                  <div>
                    <h3 className="font-semibold text-[#b8860b] mb-2">
                      Shelf Life
                    </h3>
                    <p className="text-[#f5f0e1]/70">{product.shelfLife}</p>
                  </div>
                )}
                {product.storageInfo && (
                  <div>
                    <h3 className="font-semibold text-[#b8860b] mb-2">
                      Storage
                    </h3>
                    <p className="text-[#f5f0e1]/70">{product.storageInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
