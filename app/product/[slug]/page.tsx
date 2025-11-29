import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductDetails } from "@/components/product-details";
import { RelatedProducts } from "@/components/related-products";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/product-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic rendering for Shopify data
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | House of Kumaran`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(slug, product.category);

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Breadcrumb */}
      <section className="pt-28 pb-4 px-6">
        <div className="max-w-[1400px] mx-auto">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <Link
              href="/shop"
              className="text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <Link
              href={`/shop?category=${product.category}`}
              className="text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors capitalize"
            >
              {product.category.replace("-", " ")}
            </Link>
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <span className="text-[#b8860b] truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <ProductDetails product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts}
          categoryName={product.category}
        />
      )}

      <Footer />
    </main>
  );
}
