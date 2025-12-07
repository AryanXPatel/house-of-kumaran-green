import { Navbar } from "@/components/navbar";
import { ChevronRight } from "lucide-react";

function ProductDetailsSkeleton() {
  return (
    <section className="py-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images Skeleton */}
          <div className="space-y-4">
            {/* Main Image Skeleton */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#1a472a]/30 border border-[#b8860b]/10 animate-pulse" />

            {/* Thumbnails Skeleton */}
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl bg-[#1a472a]/30 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="flex flex-col">
            {/* Rating Skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded bg-[#1a472a]/30 animate-pulse"
                  />
                ))}
              </div>
              <div className="w-24 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
            </div>

            {/* Name Skeleton */}
            <div className="w-3/4 h-12 rounded-lg bg-[#1a472a]/30 animate-pulse mb-4" />

            {/* Price Skeleton */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-10 rounded-lg bg-[#1a472a]/30 animate-pulse" />
              <div className="w-16 h-6 rounded bg-[#1a472a]/30 animate-pulse" />
              <div className="w-20 h-6 rounded-full bg-[#1a472a]/30 animate-pulse" />
            </div>

            {/* Weight Skeleton */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-20 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
              <div className="w-12 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
            </div>

            {/* Quantity & Add to Cart Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="w-36 h-14 rounded-full bg-[#1a472a]/30 animate-pulse" />
              <div className="flex-1 h-14 rounded-full bg-[#1a472a]/30 animate-pulse" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-3 mb-8">
              <div className="w-full h-4 rounded bg-[#1a472a]/30 animate-pulse" />
              <div className="w-full h-4 rounded bg-[#1a472a]/30 animate-pulse" />
              <div className="w-3/4 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
              <div className="w-5/6 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
            </div>

            {/* Trust Badges Skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-[#1a472a]/30 rounded-xl animate-pulse"
                >
                  <div className="w-6 h-6 rounded bg-[#1a472a]/50" />
                  <div className="flex-1 space-y-2">
                    <div className="w-20 h-3 rounded bg-[#1a472a]/50" />
                    <div className="w-14 h-2 rounded bg-[#1a472a]/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Breadcrumb Skeleton */}
      <section className="pt-28 pb-4 px-6">
        <div className="max-w-[1400px] mx-auto">
          <nav className="flex items-center gap-2 text-sm">
            <div className="w-12 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <div className="w-10 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <div className="w-16 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <div className="w-32 h-4 rounded bg-[#1a472a]/30 animate-pulse" />
          </nav>
        </div>
      </section>

      {/* Product Details Skeleton */}
      <ProductDetailsSkeleton />
    </main>
  );
}
