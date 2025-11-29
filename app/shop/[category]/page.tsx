import { redirect } from "next/navigation";
import { getCategories, getCategoryInfo } from "@/lib/product-service";
import { Category } from "@/lib/types";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Dynamic rendering for Shopify data
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryInfo = getCategoryInfo(category as Category);

  if (!categoryInfo) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${categoryInfo.name} | House of Kumaran`,
    description: categoryInfo.description,
  };
}

// Redirect old category URLs to new query-based URLs
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  redirect(`/shop?category=${category}`);
}
