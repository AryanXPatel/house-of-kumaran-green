import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/product-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // Require at least 2 characters for search
  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    // Get all products and filter client-side for fast response
    const allProducts = await getProducts();
    const searchLower = query.toLowerCase();

    const matchedProducts = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        p.category.toLowerCase().includes(searchLower)
    );

    // Return top 6 results with minimal data for fast response
    const results = matchedProducts.slice(0, 6).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.image,
      price: p.price,
      category: p.category,
    }));

    return NextResponse.json({ products: results, total: matchedProducts.length });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { products: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
