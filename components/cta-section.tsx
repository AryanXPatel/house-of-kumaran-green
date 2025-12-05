"use client";

import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Gift } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-16 md:py-20 bg-[#b8860b] overflow-hidden">
      {/* Decorative elements - simplified */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-[40px] border-[#0d1f14]" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-[30px] border-[#0d1f14]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left - Content */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0d1f14] leading-tight mb-4">
              Ready to taste
              <span className="block">tradition?</span>
            </h2>
            <p className="text-[#0d1f14]/70 text-base md:text-lg leading-relaxed mb-6 max-w-lg">
              Join thousands of families across India who have made House of
              Kumaran a part of their kitchen.
            </p>

            {/* Promo Code Banner */}
            <div className="flex items-center gap-4 p-5 bg-[#0d1f14]/15 rounded-2xl mb-6 border-2 border-[#0d1f14]/20">
              <Gift className="w-8 h-8 text-[#0d1f14]" />
              <div>
                <p className="font-bold text-lg text-[#0d1f14]">
                  Join the Kumaran Family!
                </p>
                <p className="text-[#0d1f14]/80">
                  <span className="font-bold">First order?</span> Free gift
                  hamper! • <span className="font-bold">5% off forever</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/shop"
                className="group px-6 py-3 bg-[#0d1f14] hover:bg-[#1a2f20] text-[#f5f0e1] font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop"
                className="px-6 py-3 border-2 border-[#0d1f14] text-[#0d1f14] hover:bg-[#0d1f14] hover:text-[#f5f0e1] font-semibold rounded-full transition-colors text-center"
              >
                View Collections
              </Link>
            </div>

            {/* Trust badges - compact grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, text: "Free shipping ₹399+" },
                { icon: ShieldCheck, text: "Quality guarantee" },
                { icon: RefreshCw, text: "Easy returns" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center text-[#0d1f14]/80 gap-1"
                >
                  <badge.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Quick stats & benefits */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "50+", label: "Products", desc: "Wide variety" },
              { value: "10K+", label: "Customers", desc: "Across India" },
              { value: "100%", label: "Natural", desc: "No preservatives" },
              { value: "28", label: "States", desc: "Delivered to" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-5 bg-[#0d1f14]/10 rounded-2xl text-center"
              >
                <p className="text-3xl md:text-4xl font-serif font-bold text-[#0d1f14]">
                  {stat.value}
                </p>
                <p className="font-semibold text-[#0d1f14] mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-[#0d1f14]/60">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
