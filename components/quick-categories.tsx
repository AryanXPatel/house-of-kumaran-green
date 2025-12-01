"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Apple,
  Cookie,
  Croissant,
  Sun,
  Zap,
  Leaf,
} from "lucide-react";
import { CategoryInfo } from "@/lib/types";

// Category icons using Lucide
const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  podis: Flame,
  pickles: Apple,
  sweets: Cookie,
  savouries: Croissant,
  vadams: Sun,
  "ready-to-mix": Zap,
  vathals: Leaf,
};

export function QuickCategories() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { getCategoriesWithCounts } = await import(
          "@/lib/product-service"
        );
        const categoriesWithCounts = await getCategoriesWithCounts();
        // Take first 6 categories that have products
        setCategories(categoriesWithCounts.slice(0, 6));
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to static categories
        const { categories: staticCategories } = await import("@/lib/products");
        setCategories(staticCategories.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="relative py-12 md:py-16 bg-[#0a1810]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-2">
              Categories
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#f5f0e1]">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-[#f5f0e1]/60 hover:text-[#b8860b] font-medium transition-colors text-sm"
          >
            All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-6 scrollbar-hide">
          {isLoading
            ? // Loading skeletons
              [...Array(6)].map((_, i) => (
                <div key={i} className="shrink-0 w-40 md:w-auto">
                  <div className="bg-[#132a1c] rounded-2xl overflow-hidden border border-[#2a4a35] animate-pulse">
                    <div className="aspect-4/3 bg-[#1a472a]/50" />
                    <div className="p-4 space-y-2">
                      <div className="w-12 h-3 bg-[#1a472a]/50 rounded" />
                      <div className="w-20 h-4 bg-[#1a472a]/50 rounded" />
                      <div className="w-16 h-3 bg-[#1a472a]/50 rounded" />
                    </div>
                  </div>
                </div>
              ))
            : categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop?category=${category.slug}`}
                  className="shrink-0 w-40 md:w-auto group"
                >
                  <div className="relative bg-[#132a1c] rounded-2xl overflow-hidden border border-[#2a4a35] hover:border-[#b8860b]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#b8860b]/10">
                    {/* Background Image */}
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0d1f14] via-[#0d1f14]/60 to-transparent" />

                      {/* Category Icon */}
                      <div className="absolute top-3 right-3">
                        {(() => {
                          const Icon = categoryIcons[category.slug] || Flame;
                          return <Icon className="w-5 h-5 text-[#b8860b]" />;
                        })()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-[#b8860b] text-xs tracking-wider mb-1">
                        {category.tamilName}
                      </p>
                      <h3 className="font-serif text-base font-bold text-[#f5f0e1] group-hover:text-[#b8860b] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-[#f5f0e1]/40 text-xs mt-1">
                        {category.productCount}{" "}
                        {category.productCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      {/* Hide scrollbar utility */}
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
