"use client"

import { useRef } from "react"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-[#0d1f14]">
        {/* Kolam pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f5f0e1' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f14] via-transparent to-[#0d1f14]" />
      </div>

      {/* Decorative leaf elements */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#b8860b]">
          <path
            fill="currentColor"
            d="M50 5 C30 20, 15 40, 15 60 C15 80, 30 95, 50 95 C70 95, 85 80, 85 60 C85 40, 70 20, 50 5 M50 20 L50 80 M30 40 Q50 50 70 40 M30 60 Q50 70 70 60"
          />
        </svg>
      </div>
      <div className="absolute bottom-20 right-10 w-40 h-40 opacity-10 rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#2a4a35]">
          <path
            fill="currentColor"
            d="M50 5 C30 20, 15 40, 15 60 C15 80, 30 95, 50 95 C70 95, 85 80, 85 60 C85 40, 70 20, 50 5 M50 20 L50 80 M30 40 Q50 50 70 40 M30 60 Q50 70 70 60"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        {/* Tagline */}
        <div className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#2a4a35] bg-[#0d1f14]/50 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#b8860b] animate-pulse" />
          <span className="text-[#f5f0e1]/70 text-sm tracking-[0.15em] uppercase">Est. 2021 in Chennai</span>
        </div>

        {/* Main headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#f5f0e1] leading-[0.9] tracking-tight mb-8">
          <span className="block">The Taste of</span>
          <span className="block text-[#b8860b] italic">Madras</span>
          <span className="block text-3xl sm:text-4xl md:text-5xl font-normal text-[#f5f0e1]/60 mt-4">
            delivered to your doorstep
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#f5f0e1]/60 leading-relaxed mb-12 font-serif">
          Handcrafted podis, pickles, sweets & savouries made the way your grandmother made them. Zero preservatives.
          Pure tradition.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group relative px-10 py-4 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Explore Collection
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
          <button className="px-10 py-4 border border-[#2a4a35] hover:border-[#f5f0e1]/30 text-[#f5f0e1] rounded-full transition-colors">
            Our Story
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 max-w-2xl mx-auto">
          {[
            { value: "50+", label: "Products" },
            { value: "10K+", label: "Happy Customers" },
            { value: "28", label: "States Delivered" },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4">
              <p className="text-3xl md:text-4xl font-serif font-bold text-[#b8860b]">{stat.value}</p>
              <p className="text-[#f5f0e1]/50 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#f5f0e1]/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </div>

      {/* Side text */}
      <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
        <span className="text-[#f5f0e1]/20 text-xs tracking-[0.3em] uppercase">House of Kumaran</span>
      </div>
      <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 rotate-90 origin-center">
        <span className="text-[#f5f0e1]/20 text-xs tracking-[0.3em] uppercase">Made in Madras</span>
      </div>
    </section>
  )
}
