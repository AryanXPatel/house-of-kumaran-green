"use client"

import Image from "next/image"
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-32 bg-[#b8860b] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[60px] border-[#0d1f14]" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-[40px] border-[#0d1f14]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#0d1f14] leading-tight mb-6">
              Ready to taste
              <span className="block">tradition?</span>
            </h2>
            <p className="text-[#0d1f14]/70 text-lg leading-relaxed mb-8 max-w-lg">
              Join thousands of families across India who have made House of Kumaran a part of their kitchen. First
              order? Get 10% off with code NAMASTE.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="group px-8 py-4 bg-[#0d1f14] hover:bg-[#1a2f20] text-[#f5f0e1] font-semibold rounded-full transition-colors flex items-center justify-center gap-2">
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-[#0d1f14] text-[#0d1f14] hover:bg-[#0d1f14] hover:text-[#f5f0e1] font-semibold rounded-full transition-colors">
                View Collections
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Truck, text: "Free shipping over ₹499" },
                { icon: ShieldCheck, text: "100% quality guarantee" },
                { icon: RefreshCw, text: "Easy returns" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-[#0d1f14]/80">
                  <badge.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Product"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Product"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Product"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Product"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Floating discount badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#0d1f14] rounded-full flex flex-col items-center justify-center text-[#f5f0e1] shadow-2xl">
              <span className="text-3xl font-bold">10%</span>
              <span className="text-xs uppercase tracking-wider">Off</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
