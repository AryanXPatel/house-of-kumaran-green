import { redirect } from "next/navigation";

// Map old category URLs to new query-based URLs
const categoryMap: Record<string, string> = {
  podi: "podis",
  pickles: "pickles",
  sweets: "sweets",
  savouries: "savouries",
  vadam: "vadams",
  "ready-mix": "ready-to-mix",
  vathals: "vathals",
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryRedirectPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const mappedCategory = categoryMap[slug] || slug;
  redirect(`/shop?category=${mappedCategory}`);
}
