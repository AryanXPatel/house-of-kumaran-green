import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { categories } from "@/lib/products"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Shop All Categories | House of Kumaran",
  description:
    "Explore our complete range of authentic South Indian foods - podis, pickles, sweets, savouries, and more.",
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 border border-[#b8860b] rounded-full" />
          <div className="absolute bottom-10 right-20 w-64 h-64 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">Explore Our Collections</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Shop by <span className="text-[#b8860b]">Category</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl">
            Each category represents a tradition, a taste, a memory of home. Discover the authentic flavours of South
            India.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className={`group relative overflow-hidden rounded-2xl bg-[#1a472a]/30 border border-[#b8860b]/10 hover:border-[#b8860b]/40 transition-all duration-500 ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div
                  className={`relative ${index === 0 ? "aspect-square md:aspect-auto md:h-full min-h-[400px]" : "aspect-[4/3]"}`}
                >
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f14] via-[#0d1f14]/50 to-transparent" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <p className="text-[#b8860b] text-sm tracking-wider mb-2 font-medium">{category.tamilName}</p>
                    <h3
                      className={`font-serif font-bold text-[#f5f0e1] mb-2 ${index === 0 ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}
                    >
                      {category.name}
                    </h3>
                    <p className={`text-[#f5f0e1]/70 mb-4 ${index === 0 ? "text-lg max-w-md" : "text-sm"}`}>
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#f5f0e1]/50 text-sm">{category.productCount} products</span>
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

      <Footer />
    </main>
  )
}
