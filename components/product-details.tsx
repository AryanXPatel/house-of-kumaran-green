"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Star, Minus, Plus, ShoppingBag, Heart, Truck, Shield, Clock, Check, Leaf } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const images = product.images || [product.image]
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    setIsAdding(true)
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
    }, 800)
  }

  return (
    <section className="py-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#1a472a]/30 border border-[#b8860b]/10">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isBestseller && (
                  <span className="px-4 py-2 bg-[#b8860b] text-[#0d1f14] text-sm font-bold rounded-full">
                    Bestseller
                  </span>
                )}
                {product.isNew && (
                  <span className="px-4 py-2 bg-[#f5f0e1] text-[#0d1f14] text-sm font-bold rounded-full">
                    New Arrival
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-[#b8860b]" : "border-transparent opacity-60 hover:opacity-100"
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
            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "fill-[#b8860b] text-[#b8860b]" : "text-[#f5f0e1]/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[#f5f0e1]/70">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Name */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-[#b8860b]">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-[#f5f0e1]/40 line-through">₹{product.originalPrice}</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Weight */}
            <div className="flex items-center gap-2 mb-6 text-[#f5f0e1]/70">
              <span>Net Weight:</span>
              <span className="font-semibold text-[#f5f0e1]">{product.weight}</span>
            </div>

            {/* Description */}
            <p className="text-lg text-[#f5f0e1]/70 leading-relaxed mb-8">
              {product.longDescription || product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center border border-[#b8860b]/20 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:text-[#b8860b] transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:text-[#b8860b] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-3 h-12 rounded-full font-semibold transition-all duration-300 ${
                  product.inStock
                    ? isAdding
                      ? "bg-green-500 text-white scale-105"
                      : "bg-[#b8860b] hover:bg-[#f5f0e1] text-[#0d1f14]"
                    : "bg-[#f5f0e1]/20 text-[#f5f0e1]/40 cursor-not-allowed"
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  isWishlisted ? "border-red-500 bg-red-500/10" : "border-[#b8860b]/20 hover:border-[#b8860b]"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#f5f0e1]"}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-[#1a472a]/30 rounded-xl">
                <Truck className="w-6 h-6 text-[#b8860b]" />
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-[#f5f0e1]/50">Orders above ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#1a472a]/30 rounded-xl">
                <Shield className="w-6 h-6 text-[#b8860b]" />
                <div>
                  <p className="font-semibold text-sm">Quality Assured</p>
                  <p className="text-xs text-[#f5f0e1]/50">100% Authentic</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#1a472a]/30 rounded-xl">
                <Clock className="w-6 h-6 text-[#b8860b]" />
                <div>
                  <p className="font-semibold text-sm">Fresh Made</p>
                  <p className="text-xs text-[#f5f0e1]/50">Made to order</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#1a472a]/30 rounded-xl">
                <Leaf className="w-6 h-6 text-[#b8860b]" />
                <div>
                  <p className="font-semibold text-sm">Zero Preservatives</p>
                  <p className="text-xs text-[#f5f0e1]/50">All natural</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="border-t border-[#b8860b]/10 pt-8 space-y-6">
              {/* Ingredients */}
              {product.ingredients && (
                <div>
                  <h3 className="font-semibold text-[#b8860b] mb-3">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="px-3 py-1 bg-[#1a472a]/30 text-sm rounded-full text-[#f5f0e1]/70"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage & Shelf Life */}
              <div className="grid grid-cols-2 gap-6">
                {product.shelfLife && (
                  <div>
                    <h3 className="font-semibold text-[#b8860b] mb-2">Shelf Life</h3>
                    <p className="text-[#f5f0e1]/70">{product.shelfLife}</p>
                  </div>
                )}
                {product.storageInfo && (
                  <div>
                    <h3 className="font-semibold text-[#b8860b] mb-2">Storage</h3>
                    <p className="text-[#f5f0e1]/70">{product.storageInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
