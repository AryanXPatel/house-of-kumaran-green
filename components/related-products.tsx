import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface RelatedProductsProps {
  products: Product[]
  categoryName: string
}

export function RelatedProducts({ products, categoryName }: RelatedProductsProps) {
  return (
    <section className="py-20 px-6 border-t border-[#b8860b]/10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-2">You May Also Like</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              More from <span className="capitalize">{categoryName.replace("-", " ")}</span>
            </h2>
          </div>
          <Link
            href={`/shop/${categoryName}`}
            className="hidden md:flex items-center gap-2 text-[#b8860b] hover:text-[#f5f0e1] transition-colors"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Link
          href={`/shop/${categoryName}`}
          className="md:hidden flex items-center justify-center gap-2 mt-8 text-[#b8860b] hover:text-[#f5f0e1] transition-colors"
        >
          View All Products
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
