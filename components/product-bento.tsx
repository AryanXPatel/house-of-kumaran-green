"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const categories = [
  {
    title: "Podi Varieties",
    subtitle: "15+ Traditional Blends",
    description: "From classic Idly Podi to aromatic Sambar Podi",
    image: "/placeholder.svg?height=600&width=600",
    featured: true,
    color: "from-[#1a472a] to-[#0d1f14]",
  },
  {
    title: "Pickles & Thokku",
    subtitle: "10 Varieties",
    description: "Tangy, spicy, unforgettable",
    image: "/placeholder.svg?height=400&width=400",
    color: "from-[#8B4513] to-[#0d1f14]",
  },
  {
    title: "Sweets",
    subtitle: "7 Classics",
    description: "Mysore Pak, Ladoo & more",
    image: "/placeholder.svg?height=400&width=400",
    color: "from-[#b8860b] to-[#0d1f14]",
  },
  {
    title: "Savouries",
    subtitle: "Crunchy Delights",
    description: "Murukku, Thattai, Mixture",
    image: "/placeholder.svg?height=400&width=400",
    color: "from-[#8B0000] to-[#0d1f14]",
  },
  {
    title: "Vadam & Appalam",
    subtitle: "Sun-dried Goodness",
    description: "Traditional rice & lentil crisps",
    image: "/placeholder.svg?height=400&width=400",
    color: "from-[#2a4a35] to-[#0d1f14]",
  },
  {
    title: "Ready-To-Mix",
    subtitle: "Quick & Authentic",
    description: "Instant traditional recipes",
    image: "/placeholder.svg?height=400&width=400",
    color: "from-[#4a3728] to-[#0d1f14]",
  },
]

export function ProductBento() {
  return (
    <section id="collections" className="relative py-32 bg-[#0a1810]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-4">Collections</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#f5f0e1]">Explore by Category</h2>
          </div>
          <button className="flex items-center gap-2 text-[#f5f0e1]/60 hover:text-[#b8860b] transition-colors group">
            <span>View all products</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured large card */}
          <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer">
            <div className={`absolute inset-0 bg-gradient-to-br ${categories[0].color}`} />
            <Image
              src={categories[0].image || "/placeholder.svg"}
              alt={categories[0].title}
              fill
              className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f14] via-transparent to-transparent" />
            <div className="relative h-full min-h-[500px] p-8 flex flex-col justify-end">
              <p className="text-[#b8860b] text-sm tracking-wider mb-2">{categories[0].subtitle}</p>
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-[#f5f0e1] mb-3">{categories[0].title}</h3>
              <p className="text-[#f5f0e1]/60 text-lg mb-6">{categories[0].description}</p>
              <div className="flex items-center gap-2 text-[#b8860b] group-hover:gap-4 transition-all">
                <span className="font-semibold">Explore Collection</span>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Smaller cards */}
          {categories.slice(1).map((category, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden cursor-pointer aspect-square">
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f14] via-transparent to-transparent" />
              <div className="relative h-full p-6 flex flex-col justify-end">
                <p className="text-[#b8860b] text-xs tracking-wider mb-1">{category.subtitle}</p>
                <h3 className="font-serif text-2xl font-bold text-[#f5f0e1] mb-1">{category.title}</h3>
                <p className="text-[#f5f0e1]/50 text-sm">{category.description}</p>
                <div className="mt-4 w-10 h-10 rounded-full border border-[#f5f0e1]/20 flex items-center justify-center group-hover:bg-[#b8860b] group-hover:border-[#b8860b] transition-all">
                  <ArrowUpRight className="w-4 h-4 text-[#f5f0e1]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
