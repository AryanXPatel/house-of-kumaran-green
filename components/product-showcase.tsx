"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ShoppingBag, Heart, ArrowLeft, ArrowRight } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Idly Milagai Podi",
    price: 150,
    originalPrice: 180,
    rating: 4.9,
    reviews: 234,
    image: "/placeholder.svg?height=500&width=500",
    tag: "Bestseller",
    weight: "200g",
  },
  {
    id: 2,
    name: "Mysore Pak",
    price: 299,
    originalPrice: 350,
    rating: 4.8,
    reviews: 189,
    image: "/placeholder.svg?height=500&width=500",
    tag: "Premium",
    weight: "250g",
  },
  {
    id: 3,
    name: "Mango Thokku",
    price: 199,
    originalPrice: 220,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=500&width=500",
    tag: "Popular",
    weight: "300g",
  },
  {
    id: 4,
    name: "Mullu Murukku",
    price: 180,
    originalPrice: 200,
    rating: 4.9,
    reviews: 312,
    image: "/placeholder.svg?height=500&width=500",
    tag: "Bestseller",
    weight: "250g",
  },
  {
    id: 5,
    name: "Sambar Podi",
    price: 130,
    originalPrice: 150,
    rating: 4.8,
    reviews: 278,
    image: "/placeholder.svg?height=500&width=500",
    tag: "Essential",
    weight: "200g",
  },
  {
    id: 6,
    name: "Elai Vadam",
    price: 120,
    originalPrice: 140,
    rating: 4.6,
    reviews: 145,
    image: "/placeholder.svg?height=500&width=500",
    tag: "Traditional",
    weight: "150g",
  },
]

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, products.length - 3)) % Math.max(1, products.length - 3))
  }

  return (
    <section className="relative py-32 bg-[#f5f0e1]">
      {/* Decorative pattern */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-[#0d1f14]">
        <svg className="absolute bottom-0 w-full h-16 text-[#f5f0e1]" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path
            fill="currentColor"
            d="M0 22L60 16.7C120 11 240 1.00001 360 0.700012C480 1.00001 600 11 720 16.7C840 22 960 22 1080 19.3C1200 16 1320 11 1380 8.30001L1440 5.70001V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z"
          />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-4">Featured Products</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a472a]">Customer Favourites</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-[#1a472a]/20 hover:border-[#1a472a] flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1a472a]" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-[#1a472a]/20 hover:border-[#1a472a] flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-[#1a472a]" />
            </button>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(currentIndex, currentIndex + 4).map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-[#1a472a] text-[#f5f0e1] text-xs font-semibold rounded-full">
                  {product.tag}
                </span>
              </div>

              {/* Wishlist button */}
              <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                <Heart className="w-4 h-4 text-[#1a472a]" />
              </button>

              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-[#f5f0e1]">
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
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-[#b8860b] text-[#b8860b]" />
                  <span className="text-sm font-semibold text-[#1a472a]">{product.rating}</span>
                  <span className="text-sm text-[#1a472a]/50">({product.reviews})</span>
                </div>

                {/* Name & Weight */}
                <h3 className="font-serif text-lg font-bold text-[#1a472a] mb-1">{product.name}</h3>
                <p className="text-[#1a472a]/50 text-sm mb-3">{product.weight}</p>

                {/* Price & Add to cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#1a472a]">₹{product.price}</span>
                    <span className="text-sm text-[#1a472a]/40 line-through">₹{product.originalPrice}</span>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-[#1a472a] hover:bg-[#b8860b] flex items-center justify-center transition-colors">
                    <ShoppingBag className="w-4 h-4 text-[#f5f0e1]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="flex justify-center mt-12">
          <button className="px-10 py-4 bg-[#1a472a] hover:bg-[#0d1f14] text-[#f5f0e1] font-semibold rounded-full transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </section>
  )
}
