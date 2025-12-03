"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Product } from "@/lib/types";

// Loading skeleton
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-[#e8e3d4]" />
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 bg-[#e8e3d4] rounded" />
        </div>
        <div className="w-3/4 h-4 bg-[#e8e3d4] rounded" />
        <div className="w-1/3 h-3 bg-[#e8e3d4] rounded" />
        <div className="flex items-center justify-between pt-1">
          <div className="w-12 h-4 bg-[#e8e3d4] rounded" />
          <div className="w-9 h-9 bg-[#e8e3d4] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart, setIsCartOpen } = useShopifyCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showcaseProducts, setShowcaseProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { getNewAndPopular, getProducts } = await import(
          "@/lib/product-service"
        );

        // First try to get from Shopify "New & Popular" collection
        const newPopularProducts = await getNewAndPopular();

        // If we have products from the collection, use them
        if (newPopularProducts.length > 0) {
          setShowcaseProducts(newPopularProducts.slice(0, 8));
        } else {
          // Fallback: mix new arrivals with other products
          const allProducts = await getProducts();
          const newArrivals = allProducts.filter((p) => p.isNew);
          const otherProducts = allProducts.filter(
            (p) => !p.isNew && !p.isBestseller
          );
          const combined = [
            ...newArrivals.slice(0, 3),
            ...otherProducts.slice(0, 5),
          ].slice(0, 8);

          setShowcaseProducts(
            combined.length >= 4 ? combined : allProducts.slice(0, 8)
          );
        }
      } catch (error) {
        console.error("Error fetching showcase products:", error);
        // Fallback to static products
        const { products } = await import("@/lib/products");
        const showcase = [
          ...products.filter((p) => p.isNew).slice(0, 3),
          ...products.filter((p) => !p.isNew && !p.isBestseller).slice(0, 5),
        ].slice(0, 8);
        setShowcaseProducts(showcase);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex(
      (prev) => (prev + 1) % Math.max(1, showcaseProducts.length - 3)
    );
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.max(1, showcaseProducts.length - 3)) %
        Math.max(1, showcaseProducts.length - 3)
    );
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <section className="relative py-16 md:py-20 bg-[#f5f0e1]">
      {/* Decorative pattern - simplified */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-[#0a1810]">
        <svg
          className="absolute bottom-0 w-full h-10 text-[#f5f0e1]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 54"
        >
          <path
            fill="currentColor"
            d="M0 22L60 16.7C120 11 240 1.00001 360 0.700012C480 1.00001 600 11 720 16.7C840 22 960 22 1080 19.3C1200 16 1320 11 1380 8.30001L1440 5.70001V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z"
          />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-2">
              Explore More
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a472a]">
              New & Popular
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border-2 border-[#1a472a]/20 hover:border-[#1a472a] hover:bg-[#1a472a] hover:text-[#f5f0e1] flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border-2 border-[#1a472a]/20 hover:border-[#1a472a] hover:bg-[#1a472a] hover:text-[#f5f0e1] flex items-center justify-center transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
            : showcaseProducts
                .slice(currentIndex, currentIndex + 4)
                .map((product) => {
                  const discount = product.originalPrice
                    ? Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )
                    : 0;

                  return (
                    <Link
                      href={`/product/${product.slug}`}
                      key={product.id}
                      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      {/* Tags */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="px-2 py-0.5 bg-[#f5f0e1] text-[#1a472a] text-[10px] font-bold rounded-full">
                            New
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      {/* Wishlist button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ${
                          isInWishlist(product.id)
                            ? "bg-red-500/20 hover:bg-red-500/30"
                            : "bg-white/80 hover:bg-white"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isInWishlist(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-[#1a472a]"
                          }`}
                        />
                      </button>

                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-[#f5f0e1]">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 fill-[#b8860b] text-[#b8860b]" />
                          <span className="text-xs font-semibold text-[#1a472a]">
                            {product.rating}
                          </span>
                          <span className="text-xs text-[#1a472a]/50">
                            ({product.reviews})
                          </span>
                        </div>

                        {/* Name & Weight */}
                        <h3 className="font-serif text-sm md:text-base font-bold text-[#1a472a] mb-0.5 group-hover:text-[#b8860b] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-[#1a472a]/50 text-xs mb-2">
                          {product.weight}
                        </p>

                        {/* Price & Add to cart - Always visible */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-base md:text-lg font-bold text-[#1a472a]">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#1a472a]/40 line-through ml-1">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={!product.inStock}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                              product.inStock
                                ? "bg-[#1a472a] hover:bg-[#b8860b] hover:scale-110"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4 text-[#f5f0e1]" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
        </div>

        {/* View all button */}
        <div className="flex justify-center mt-10">
          <Link
            href="/shop"
            className="px-8 py-3 bg-[#1a472a] hover:bg-[#0d1f14] text-[#f5f0e1] font-semibold rounded-full transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
