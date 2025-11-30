"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";
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

export function NewAndPopularProducts() {
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { getNewAndPopular, getNewArrivals } = await import(
          "@/lib/product-service"
        );
        let fetchedProducts = await getNewAndPopular();
        // Fallback to new arrivals if empty
        if (fetchedProducts.length === 0) {
          fetchedProducts = await getNewArrivals();
        }
        setProducts(fetchedProducts.slice(0, 4));
      } catch (error) {
        console.error("Error fetching new & popular products:", error);
        // Fallback to static products
        const { products: staticProducts } = await import("@/lib/products");
        setProducts(staticProducts.filter((p) => p.isNew).slice(0, 4));
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

  // Don't render if no products
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 bg-[#0d1f14]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#b8860b]" />
              <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase">
                Fresh Picks
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#f5f0e1]">
              New & Popular
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-[#b8860b] hover:text-[#d4a017] font-semibold transition-colors group"
          >
            View Collections
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
            : products.map((product) => {
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
                      {/* Tags */}
                      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
                        {product.isNew && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                            New
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="px-2 py-0.5 bg-[#b8860b] text-[#0d1f14] text-[10px] font-bold rounded-full">
                            Popular
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </div>

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
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 fill-[#b8860b] text-[#b8860b]" />
                          <span className="text-xs font-semibold text-[#f5f0e1]">
                            {product.rating}
                          </span>
                          <span className="text-xs text-[#f5f0e1]/40">
                            ({product.reviews})
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="font-serif text-sm font-bold text-[#f5f0e1] mb-1 group-hover:text-[#b8860b] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-[#f5f0e1]/50 text-xs mb-2">
                          {product.weight}
                        </p>

                        {/* Price & Add to cart */}
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
