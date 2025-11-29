import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PhilosophySection } from "@/components/philosophy-section";
import { CraftSection } from "@/components/craft-section";
import { RegionalSection } from "@/components/regional-section";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Story | House of Kumaran - Authentic South Indian Foods",
  description:
    "Discover the story behind House of Kumaran. Learn about our commitment to authentic South Indian flavors, traditional recipes, and zero-preservative foods.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero Section for About */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 border border-[#b8860b] rounded-full" />
          <div className="absolute bottom-10 right-20 w-64 h-64 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">
            About Us
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Our <span className="text-[#b8860b]">Story</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl mb-8">
            From a small kitchen in Chennai to thousands of homes across India —
            this is the story of how tradition, love, and quality came together.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
            >
              Shop Our Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#b8860b]/50 text-[#f5f0e1] rounded-full hover:border-[#b8860b] transition-colors"
            >
              View Bestsellers
            </Link>
          </div>
        </div>
      </section>

      {/* The Kumaran Story */}
      <section className="py-20 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-4">
                The Beginning
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#f5f0e1] mb-6">
                A Family&apos;s Legacy, Now Yours
              </h2>
              <div className="space-y-4 text-[#f5f0e1]/70 leading-relaxed">
                <p>
                  House of Kumaran was born from a simple belief — that the
                  authentic tastes of South India shouldn&apos;t be lost to
                  convenience and mass production.
                </p>
                <p>
                  Started in 2021 by the Kumaran family in Chennai, we began by
                  sharing our grandmother&apos;s recipes with friends and
                  family. The overwhelming response led us to realize that
                  people everywhere were craving these authentic flavors.
                </p>
                <p>
                  Today, we serve thousands of families across 28 states, but
                  our process remains the same — small batches, traditional
                  methods, and an unwavering commitment to quality.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-[#1a472a]/30 border border-[#b8860b]/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-6xl font-serif font-bold text-[#b8860b]">
                    2021
                  </p>
                  <p className="text-[#f5f0e1]/60 mt-2">Founded in Chennai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Full content here */}
      <PhilosophySection />

      {/* Craft Section - Full content here */}
      <CraftSection />

      {/* Regional Section - Full content here */}
      <RegionalSection />

      {/* Call to Action */}
      <section className="py-20 px-6 bg-[#b8860b]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0d1f14] mb-6">
            Ready to Taste the Difference?
          </h2>
          <p className="text-[#0d1f14]/70 text-lg mb-8 max-w-xl mx-auto">
            Experience the authentic flavors of South India. Use code NAMASTE
            for 10% off your first order.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0d1f14] text-[#f5f0e1] font-semibold rounded-full hover:bg-[#1a2f20] transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
