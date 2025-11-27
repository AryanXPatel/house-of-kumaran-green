"use client"

import { useState } from "react"
import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/product-card"
import { ChevronDown } from "lucide-react"

interface ProductGridProps {
  products: Product[]
}

type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest"

export function ProductGrid({ products }: ProductGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [isOpen, setIsOpen] = useState(false)

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return a.isNew ? -1 : 1
      default:
        return a.isBestseller ? -1 : 1
    }
  })

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ]

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="flex justify-end mb-8">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-[#b8860b]/20 rounded-lg hover:border-[#b8860b]/40 transition-colors"
          >
            <span className="text-sm text-[#f5f0e1]/70">Sort by:</span>
            <span className="text-sm font-medium">{sortOptions.find((o) => o.value === sortBy)?.label}</span>
            <ChevronDown className={`w-4 h-4 text-[#b8860b] transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a472a] border border-[#b8860b]/20 rounded-lg overflow-hidden z-20">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-[#b8860b]/10 transition-colors ${
                    sortBy === option.value ? "text-[#b8860b]" : "text-[#f5f0e1]/70"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#f5f0e1]/50 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}
