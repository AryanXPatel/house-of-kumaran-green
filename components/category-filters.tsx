"use client"

import type { CategoryInfo } from "@/lib/types"
import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Filter } from "lucide-react"

interface CategoryFiltersProps {
  categories: CategoryInfo[]
  currentCategory: string
}

export function CategoryFilters({ categories, currentCategory }: CategoryFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="lg:sticky lg:top-24">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-[#1a472a]/30 rounded-xl border border-[#b8860b]/10 mb-4"
      >
        <span className="flex items-center gap-2 font-medium">
          <Filter className="w-5 h-5 text-[#b8860b]" />
          Filters
        </span>
        <ChevronDown className={`w-5 h-5 text-[#b8860b] transition-transform ${showFilters ? "rotate-180" : ""}`} />
      </button>

      <div className={`space-y-8 ${showFilters ? "block" : "hidden lg:block"}`}>
        {/* Categories */}
        <div>
          <h3 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">Categories</h3>
          <div className="space-y-2">
            <Link
              href="/shop"
              className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                !currentCategory
                  ? "bg-[#b8860b]/10 text-[#b8860b]"
                  : "text-[#f5f0e1]/70 hover:text-[#f5f0e1] hover:bg-[#1a472a]/30"
              }`}
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                  currentCategory === cat.slug
                    ? "bg-[#b8860b]/10 text-[#b8860b]"
                    : "text-[#f5f0e1]/70 hover:text-[#f5f0e1] hover:bg-[#1a472a]/30"
                }`}
              >
                <span className="flex justify-between">
                  {cat.name}
                  <span className="text-[#f5f0e1]/30">{cat.productCount}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">Price Range</h3>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
              className="w-full accent-[#b8860b]"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#f5f0e1]/70">₹{priceRange[0]}</span>
              <span className="text-[#f5f0e1]/70">₹{priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">Quick Filters</h3>
          <div className="flex flex-wrap gap-2">
            {["Bestseller", "New", "Traditional", "Spicy", "Healthy"].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 text-xs border border-[#b8860b]/20 rounded-full text-[#f5f0e1]/70 hover:border-[#b8860b] hover:text-[#b8860b] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
