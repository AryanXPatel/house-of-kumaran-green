"use client"

import Image from "next/image"

const steps = [
  {
    number: "01",
    title: "Source",
    description: "We handpick ingredients from trusted farmers across Tamil Nadu who share our values.",
  },
  {
    number: "02",
    title: "Prepare",
    description: "Traditional stone grinding, sun drying, and age-old techniques preserved through generations.",
  },
  {
    number: "03",
    title: "Perfect",
    description: "Every batch is tasted and tested to match the authentic flavours we grew up with.",
  },
  {
    number: "04",
    title: "Pack",
    description: "Freshly packed and shipped to preserve the aroma and taste until it reaches you.",
  },
]

export function CraftSection() {
  return (
    <section id="our-craft" className="relative py-32 bg-[#0d1f14]">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=1200&width=1920"
          alt="Traditional kitchen"
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f14] via-[#0d1f14]/90 to-[#0d1f14]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-4">Our Craft</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5f0e1] leading-tight mb-8">
              From Our Kitchen
              <span className="block text-[#f5f0e1]/40">to Yours</span>
            </h2>
            <p className="text-[#f5f0e1]/60 text-lg leading-relaxed mb-12">
              Every product from House of Kumaran follows a journey of care and tradition. We don't just make food — we
              preserve a legacy.
            </p>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0">
                    <span className="font-serif text-4xl font-bold text-[#2a4a35] group-hover:text-[#b8860b] transition-colors">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#f5f0e1] mb-2">{step.title}</h3>
                    <p className="text-[#f5f0e1]/50 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=400"
                    alt="Stone grinding"
                    width={400}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Sun drying"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Traditional spices"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=400"
                    alt="Traditional cooking"
                    width={400}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#b8860b] rounded-2xl p-6 text-[#0d1f14]">
              <p className="text-4xl font-serif font-bold">100%</p>
              <p className="text-sm font-semibold">Handcrafted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
