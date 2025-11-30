"use client"

import { Leaf, Heart, ShieldCheck, Flame } from "lucide-react"

const values = [
  {
    icon: Leaf,
    title: "Zero Preservatives",
    description: "Every product is made fresh with pure, natural ingredients. No chemicals, no shortcuts.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Traditional recipes passed down through generations, prepared with the same care as home.",
  },
  {
    icon: ShieldCheck,
    title: "Quality First",
    description: "We source the finest ingredients from trusted farmers across Tamil Nadu.",
  },
  {
    icon: Flame,
    title: "Authentic Taste",
    description: "The same flavours that have defined South Indian kitchens for centuries.",
  },
]

export function PhilosophySection() {
  return (
    <section className="relative py-32 bg-[#0d1f14] overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #f5f0e1 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="max-w-3xl mb-20">
          <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-4">Our Philosophy</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5f0e1] leading-tight mb-6">
            Where tradition meets
            <span className="block text-[#f5f0e1]/40">uncompromising quality</span>
          </h2>
          <p className="text-[#f5f0e1]/60 text-lg leading-relaxed">
            In an age of mass production, we choose the slower path. Each jar, each packet carries the essence of South
            Indian homes — where food is not just sustenance, but a celebration of culture.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl border border-[#2a4a35] bg-[#0d1f14] hover:border-[#b8860b]/50 hover:bg-[#132a1c] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2a4a35] flex items-center justify-center mb-6 group-hover:bg-[#b8860b]/20 transition-colors">
                <value.icon className="w-6 h-6 text-[#b8860b]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#f5f0e1] mb-3">{value.title}</h3>
              <p className="text-[#f5f0e1]/50 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-20 py-16 border-t border-b border-[#2a4a35]">
          <blockquote className="max-w-4xl mx-auto text-center">
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#f5f0e1]/80 italic leading-relaxed">
              &quot;Food is memories. Every spoonful of our podi takes you back to your grandmother&apos;s kitchen, to lazy Sunday
              afternoons, to the taste of home.&quot;
            </p>
            <footer className="mt-8">
              <p className="text-[#b8860b] font-semibold">Kumaran Family</p>
              <p className="text-[#f5f0e1]/40 text-sm">Founders, House of Kumaran</p>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
