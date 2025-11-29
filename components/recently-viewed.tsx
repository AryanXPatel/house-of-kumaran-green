"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, X } from "lucide-react";
import { useRecentlyViewed } from "@/lib/recently-viewed-context";

export function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-6 bg-[#0a1810]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#b8860b]" />
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#f5f0e1]">
              Recently Viewed
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={clearRecentlyViewed}
              className="text-sm text-[#f5f0e1]/50 hover:text-[#f5f0e1] transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-1 text-sm text-[#b8860b] hover:text-[#d4a017] transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Products - Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recentlyViewed.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="flex-shrink-0 w-36 md:w-44 group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a472a]/30 border border-[#b8860b]/10 group-hover:border-[#b8860b]/30 transition-colors">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-[#f5f0e1] truncate group-hover:text-[#b8860b] transition-colors">
                  {product.name}
                </p>
                <p className="text-sm text-[#b8860b] font-semibold">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
