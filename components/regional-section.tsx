"use client"

import Image from "next/image"
import { MapPin } from "lucide-react"

const regions = [
  {
    name: "Chennai Specials",
    description: "The authentic taste of Madras",
    products: ["Idly Podi", "Filter Coffee", "Murukku"],
    image: "/images/Story/Chennai-Specials.png",
  },
  {
    name: "Thanjavur Traditions",
    description: "From the delta heartland",
    products: ["Degree Coffee", "Sweet Pongal Mix", "Thokku"],
    image: "/images/Story/Thanjavur.png",
  },
  {
    name: "Chettinad Flavours",
    description: "Bold, spicy, unforgettable",
    products: ["Chettinad Masala", "Pepper Podi", "Kuzhambu Podi"],
    image: "/images/Story/Chettinad.png",
  },
]

export function RegionalSection() {
  return (
    <section className="relative py-32 bg-[#f5f0e1] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%231a472a'%3E%3Cpath d='M40 0L80 40 40 80 0 40z' fillOpacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-4">Regional Treasures</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a472a] mb-6">
            Taste of Tamil Nadu
          </h2>
          <p className="text-[#1a472a]/60 text-lg">
            Each region of Tamil Nadu has its own culinary identity. We bring you the best from every corner of our
            beautiful state.
          </p>
        </div>

        {/* Regions */}
        <div className="space-y-8">
          {regions.map((region, i) => (
            <div
              key={i}
              className={`group flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-center`}
            >
              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden">
                  <Image
                    src={region.image || "/placeholder.svg"}
                    alt={region.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f14]/80 via-transparent to-transparent" />

                  {/* Region badge */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                    <MapPin className="w-4 h-4 text-[#b8860b]" />
                    <span className="font-serif font-semibold text-[#1a472a]">{region.name}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 w-full lg:px-8">
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#1a472a] mb-4">{region.name}</h3>
                <p className="text-[#1a472a]/60 text-lg mb-6">{region.description}</p>

                {/* Featured products */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {region.products.map((product, j) => (
                    <span
                      key={j}
                      className="px-4 py-2 bg-[#1a472a]/5 border border-[#1a472a]/10 rounded-full text-[#1a472a] text-sm"
                    >
                      {product}
                    </span>
                  ))}
                </div>

                <button className="inline-flex items-center gap-2 text-[#b8860b] font-semibold hover:gap-4 transition-all">
                  <span>Explore {region.name}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
