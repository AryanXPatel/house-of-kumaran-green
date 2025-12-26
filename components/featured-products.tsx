"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Product } from "@/lib/types";

// Loading skeleton
function ProductSkeleton() {
  return (
    <div className="bg-[#1a472a]/30 rounded-xl overflow-hidden border border-[#b8860b]/10 animate-pulse">
      <div className="aspect-square bg-[#1a472a]/50" />
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 bg-[#1a472a]/50 rounded" />
        </div>
        <div className="w-3/4 h-4 bg-[#1a472a]/50 rounded" />
        <div className="w-1/3 h-3 bg-[#1a472a]/50 rounded" />
        <div className="flex items-center justify-between pt-1">
          <div className="w-12 h-4 bg-[#1a472a]/50 rounded" />
          <div className="w-8 h-8 bg-[#1a472a]/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { addToCart, setIsCartOpen } = useShopifyCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Store ratings separately for real-time updates
  const [productRatings, setProductRatings] = useState<
    Record<string, { average: number; count: number }>
  >({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { getBestsellers, getProducts } = await import(
          "@/lib/product-service"
        );
        let products = await getBestsellers();
        // If no bestsellers, get first 6 products
        if (products.length === 0) {
          const allProducts = await getProducts();
          products = allProducts.slice(0, 6);
        }
        const slicedProducts = products.slice(0, 6);
        setFeaturedProducts(slicedProducts);

        // Fetch real ratings from Judge.me
        const productIds = slicedProducts.map((p) => p.shopifyId || p.id);
        if (productIds.length > 0) {
          try {
            const response = await fetch("/api/products/ratings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productIds }),
            });
            const data = await response.json();
            if (data.success && data.ratings) {
              setProductRatings(data.ratings);
            }
          } catch (ratingError) {
            console.error("Error fetching ratings:", ratingError);
          }
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Fallback to static products
        const { products } = await import("@/lib/products");
        setFeaturedProducts(products.filter((p) => p.isBestseller).slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <section className="relative py-16 md:py-20 bg-[#0d1f14]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-2">
              Shop Now
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#f5f0e1]">
              Bestsellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#b8860b] hover:text-[#d4a017] font-semibold transition-colors group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products grid - with loading state */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {isLoading
            ? [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
            : featuredProducts.map((product) => {
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
                  className="group"
                >
                  <div className="relative bg-[#1a472a]/30 rounded-xl overflow-hidden border border-[#b8860b]/10 hover:border-[#b8860b]/40 transition-all duration-300">
                    {/* Tag */}
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                      {product.isBestseller && (
                        <span className="px-2 py-0.5 bg-[#b8860b] text-[#0d1f14] text-[10px] font-bold rounded-full">
                          Bestseller
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
                      className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ${isInWishlist(product.id)
                        ? "bg-red-500/20 hover:bg-red-500/30"
                        : "bg-[#0d1f14]/50 hover:bg-[#0d1f14]/70"
                        }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isInWishlist(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-[#f5f0e1]"
                          }`}
                      />
                    </button>

                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      {/* Rating - use real ratings from Judge.me */}
                      {(() => {
                        const productId = product.shopifyId || product.id;
                        const realRating = productRatings[productId] || productRatings[product.id];
                        const rating = realRating?.average || 0;
                        const reviewCount = realRating?.count || 0;

                        // Only show rating if there are reviews
                        if (reviewCount > 0) {
                          return (
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-3 h-3 fill-[#b8860b] text-[#b8860b]" />
                              <span className="text-xs font-semibold text-[#f5f0e1]">
                                {rating.toFixed(1)}
                              </span>
                              <span className="text-xs text-[#f5f0e1]/40">
                                ({reviewCount})
                              </span>
                            </div>
                          );
                        }
                        // Show placeholder for products with no reviews
                        return (
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 text-[#f5f0e1]/20" />
                            <span className="text-xs text-[#f5f0e1]/40">
                              No reviews yet
                            </span>
                          </div>
                        );
                      })()}

                      {/* Name */}
                      <h3 className="font-serif text-sm font-bold text-[#f5f0e1] mb-1 group-hover:text-[#b8860b] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-[#f5f0e1]/50 text-xs mb-2">
                        {product.weight}
                      </p>

                      {/* Price & Add to cart - Always visible */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-base font-bold text-[#f5f0e1]">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-[#f5f0e1]/40 line-through ml-1">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-8 h-8 rounded-full bg-[#b8860b] hover:bg-[#d4a017] flex items-center justify-center transition-all duration-200 hover:scale-110"
                        >
                          <ShoppingBag className="w-4 h-4 text-[#0d1f14]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
}
