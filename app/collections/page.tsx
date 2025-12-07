import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCategoriesWithCounts } from "@/lib/product-service";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Collections | House of Kumaran",
  description:
    "Explore our curated collections of authentic South Indian foods - podis, pickles, sweets, savouries, and more.",
};

// Revalidate every 60 seconds to keep counts fresh
export const revalidate = 60;

export default async function CollectionsPage() {
  // Fetch categories with dynamic product counts
  const categories = await getCategoriesWithCounts();

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 border border-[#b8860b] rounded-full" />
          <div className="absolute bottom-10 right-20 w-64 h-64 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/"
              className="text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <span className="text-[#b8860b]">Collections</span>
          </nav>

          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">
            Explore Our Collections
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Shop by <span className="text-[#b8860b]">Category</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl mb-8">
            Each category represents a tradition, a taste, a memory of home.
            Discover the authentic flavours of South India.
          </p>

          {/* Quick Link to All Products */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className={`group relative overflow-hidden rounded-2xl bg-[#1a472a]/30 border border-[#b8860b]/10 hover:border-[#b8860b]/40 transition-all duration-500 ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div
                  className={`relative ${
                    index === 0
                      ? "aspect-square md:aspect-auto md:h-full min-h-[400px]"
                      : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f14] via-[#0d1f14]/25 to-transparent" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <p className="text-[#b8860b] text-sm tracking-wider mb-2 font-medium">
                      {category.tamilName}
                    </p>
                    <h3
                      className={`font-serif font-bold text-[#f5f0e1] mb-2 ${
                        index === 0
                          ? "text-4xl md:text-5xl"
                          : "text-2xl md:text-3xl"
                      }`}
                    >
                      {category.name}
                    </h3>
                    <p
                      className={`text-[#f5f0e1]/70 mb-4 ${
                        index === 0 ? "text-lg max-w-md" : "text-sm"
                      }`}
                    >
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#f5f0e1]/50 text-sm">
                        {category.productCount} products
                      </span>
                      <div className="w-12 h-12 rounded-full border border-[#b8860b]/30 group-hover:border-[#b8860b] group-hover:bg-[#b8860b] flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-5 h-5 text-[#b8860b] group-hover:text-[#0d1f14] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Products CTA */}
      <section className="py-12 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Can&apos;t decide? Browse everything
          </h2>
          <p className="text-[#f5f0e1]/60 mb-6 max-w-lg mx-auto">
            Explore our complete range of authentic South Indian foods with
            powerful filters and search.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#b8860b] text-[#0d1f14] font-bold rounded-full hover:bg-[#d4a017] transition-colors"
          >
            Shop All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
