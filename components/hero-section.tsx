"use client";

import Link from "next/link";
import { ArrowRight, Truck, Shield, Leaf } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
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

      {/* Decorative leaf element */}
      <div className="absolute top-24 right-10 w-32 h-32 opacity-10 hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#b8860b]">
          <path
            fill="currentColor"
            d="M50 5 C30 20, 15 40, 15 60 C15 80, 30 95, 50 95 C70 95, 85 80, 85 60 C85 40, 70 20, 50 5 M50 20 L50 80 M30 40 Q50 50 70 40 M30 60 Q50 70 70 60"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center pt-8">
        {/* Main headline - slightly smaller */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#f5f0e1] leading-[0.95] tracking-tight mb-6">
          <span className="block">The Taste of</span>
          <span className="block text-[#b8860b] italic">Madras</span>
        </h1>

        {/* Description - condensed */}
        <p className="max-w-xl mx-auto text-base md:text-lg text-[#f5f0e1]/60 leading-relaxed mb-8">
          Handcrafted podis, pickles, sweets & savouries. Zero preservatives.
          Pure tradition.
        </p>

        {/* CTA Buttons - More prominent */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/shop"
            className="group px-8 py-4 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-bold rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#b8860b]/20"
          >
            Shop Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#products"
            className="px-8 py-4 border border-[#b8860b]/50 hover:border-[#b8860b] text-[#f5f0e1] hover:text-[#b8860b] rounded-full transition-all duration-300"
          >
            View Bestsellers
          </Link>
        </div>

        {/* Quick category links with visual demarcation */}
        <div className="mb-10">
          <p className="text-[#b8860b] text-xs tracking-[0.2em] uppercase mb-4">
            Shop by Category
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {[
              { name: "Podis", slug: "podis" },
              { name: "Pickles & Thokku", slug: "pickles" },
              { name: "Sweets", slug: "sweets" },
              { name: "Savouries", slug: "savouries" },
              { name: "Vadams & Appalam", slug: "vadams" },
              { name: "Ready-to-Mix", slug: "ready-to-mix" },
            ].map((cat, index, arr) => (
              <div key={cat.slug} className="flex items-center gap-3 md:gap-4">
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base lg:text-lg font-medium text-[#f5f0e1]/80 hover:text-[#0d1f14] border border-[#b8860b]/40 hover:border-[#b8860b] hover:bg-[#b8860b] rounded-full transition-all duration-200"
                >
                  {cat.name}
                </Link>
                {index < arr.length - 1 && (
                  <span className="hidden md:block w-1 h-1 rounded-full bg-[#b8860b]/50" />
                )}
              </div>
            ))}
            <Link
              href="/shop"
              className="px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base lg:text-lg font-semibold text-[#0d1f14] bg-[#b8860b] hover:bg-[#d4a017] border border-[#b8860b] rounded-full transition-all duration-200 flex items-center gap-2"
            >
              All Products
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>

        {/* Trust badges - Compact */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[#f5f0e1]/50">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#b8860b]" />
            <span className="text-xs md:text-sm">Free Shipping ₹399+</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#b8860b]" />
            <span className="text-xs md:text-sm">100% Natural</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#b8860b]" />
            <span className="text-xs md:text-sm">Quality Guaranteed</span>
          </div>
        </div>

        {/* Stats - Compact inline */}
        <div className="mt-10 flex items-center justify-center gap-8 md:gap-12">
          {[
            { value: "50+", label: "Products" },
            { value: "10K+", label: "Happy Customers" },
            { value: "28", label: "States" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-serif font-bold text-[#b8860b]">
                {stat.value}
              </p>
              <p className="text-[#f5f0e1]/40 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Side text - hidden on smaller screens */}
      <div className="hidden xl:block absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
        <span className="text-[#f5f0e1]/20 text-xs tracking-[0.3em] uppercase">
          House of Kumaran
        </span>
      </div>
      <div className="hidden xl:block absolute right-6 top-1/2 -translate-y-1/2 rotate-90 origin-center">
        <span className="text-[#f5f0e1]/20 text-xs tracking-[0.3em] uppercase">
          Made in Madras
        </span>
      </div>
    </section>
  );
}
