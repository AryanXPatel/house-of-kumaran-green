import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { ProductBento } from "@/components/product-bento"
import { CraftSection } from "@/components/craft-section"
import { ProductShowcase } from "@/components/product-showcase"
import { RegionalSection } from "@/components/regional-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <ProductBento />
      <CraftSection />
      <ProductShowcase />
      <RegionalSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
