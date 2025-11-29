import { redirect } from "next/navigation";
import { categories, getCategoryBySlug } from "@/lib/products";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryInfo = getCategoryBySlug(category);

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
