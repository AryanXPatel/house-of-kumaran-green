import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturedProducts } from "@/components/featured-products";
import { NewAndPopularProducts } from "@/components/new-and-popular";
import { QuickCategories } from "@/components/quick-categories";
import { ProductShowcase } from "@/components/product-showcase";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      {/* Products immediately after hero - within 1 scroll */}
      <div id="products">
        <FeaturedProducts />
      </div>
      <NewAndPopularProducts />
      <QuickCategories />
      <ProductShowcase />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
