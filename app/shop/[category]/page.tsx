import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilters } from "@/components/category-filters"
import { categories, getProductsByCategory, getCategoryBySlug } from "@/lib/products"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryInfo = getCategoryBySlug(category)

  if (!categoryInfo) {
    return { title: "Category Not Found" }
  }

  return {
    title: `${categoryInfo.name} | House of Kumaran`,
    description: categoryInfo.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryInfo = getCategoryBySlug(category)

  if (!categoryInfo) {
    notFound()
  }

  const categoryProducts = getProductsByCategory(category)

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Breadcrumb & Header */}
      <section className="pt-28 pb-12 px-6 border-b border-[#b8860b]/10">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <Link href="/shop" className="text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <span className="text-[#b8860b]">{categoryInfo.name}</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[#b8860b] text-lg mb-2 font-medium">{categoryInfo.tamilName}</p>
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">{categoryInfo.name}</h1>
              <p className="text-[#f5f0e1]/70 text-lg max-w-xl">{categoryInfo.description}</p>
            </div>
            <p className="text-[#f5f0e1]/50">{categoryProducts.length} products</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <CategoryFilters categories={categories} currentCategory={category} />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <ProductGrid products={categoryProducts} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
