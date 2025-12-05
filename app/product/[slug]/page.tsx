import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductDetails } from "@/components/product-details";
import { ProductReviews } from "@/components/product-reviews";
import { RelatedProducts } from "@/components/related-products";
import { getProductBySlug, getRelatedProducts } from "@/lib/product-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic rendering for Shopify data
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://houseofkumaran.com";

  return {
    title: `${product.name} | House of Kumaran`,
    description:
      product.description ||
      `Shop ${product.name} - Premium quality from House of Kumaran`,
    keywords: [
      product.name,
      product.category,
      "House of Kumaran",
      "authentic Indian products",
      "premium quality",
    ],
    openGraph: {
      title: `${product.name} | House of Kumaran`,
      description:
        product.description ||
        `Shop ${product.name} - Premium quality from House of Kumaran`,
      url: `${baseUrl}/product/${slug}`,
      siteName: "House of Kumaran",
      images: product.images?.[0]
        ? [
            {
              url: product.images[0],
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | House of Kumaran`,
      description:
        product.description ||
        `Shop ${product.name} - Premium quality from House of Kumaran`,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
    alternates: {
      canonical: `${baseUrl}/product/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(slug, product.category);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://houseofkumaran.com";

  // JSON-LD Structured Data for Product
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "House of Kumaran",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "House of Kumaran",
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      {/* Product Reviews - Judge.me Integration */}
      <ProductReviews
        productId={product.shopifyId || product.id}
        productTitle={product.name}
        productHandle={product.slug}
      />

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
