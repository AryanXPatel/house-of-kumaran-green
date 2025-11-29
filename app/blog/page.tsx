import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

export const metadata = {
  title: "Blog | House of Kumaran - Recipes, Tips & Stories",
  description:
    "Discover authentic South Indian recipes, cooking tips, and stories from House of Kumaran. Learn traditional cooking methods and explore our culinary heritage.",
};

const blogPosts = [
  {
    id: 1,
    title: "The Art of Making Perfect Podi: A Traditional Guide",
    excerpt:
      "Learn the secrets behind making authentic South Indian podis at home with tips from our master chefs.",
    category: "Recipes",
    date: "Nov 25, 2025",
    readTime: "5 min read",
    image: "/placeholder.svg?height=400&width=600",
    slug: "art-of-making-podi",
  },
  {
    id: 2,
    title: "5 Health Benefits of Traditional South Indian Pickles",
    excerpt:
      "Discover why your grandmother's pickle recipe is not just delicious but also incredibly healthy.",
    category: "Health",
    date: "Nov 20, 2025",
    readTime: "4 min read",
    image: "/placeholder.svg?height=400&width=600",
    slug: "health-benefits-pickles",
  },
  {
    id: 3,
    title: "From Chennai to Your Kitchen: Our Journey",
    excerpt:
      "The story of how House of Kumaran went from a small family kitchen to serving thousands across India.",
    category: "Story",
    date: "Nov 15, 2025",
    readTime: "6 min read",
    image: "/placeholder.svg?height=400&width=600",
    slug: "our-journey",
  },
  {
    id: 4,
    title: "Summer Specials: Cool Recipes with Our Podis",
    excerpt:
      "Beat the heat with these refreshing recipes using our signature podis and chutneys.",
    category: "Recipes",
    date: "Nov 10, 2025",
    readTime: "3 min read",
    image: "/placeholder.svg?height=400&width=600",
    slug: "summer-recipes",
  },
  {
    id: 5,
    title: "The Science Behind Zero-Preservative Food",
    excerpt:
      "How we keep our products fresh and flavorful without any artificial preservatives.",
    category: "Behind the Scenes",
    date: "Nov 5, 2025",
    readTime: "5 min read",
    image: "/placeholder.svg?height=400&width=600",
    slug: "zero-preservative-science",
  },
  {
    id: 6,
    title: "Regional Flavors: Exploring Chettinad Cuisine",
    excerpt:
      "A deep dive into the spicy, aromatic world of Chettinad cooking and its unique ingredients.",
    category: "Culture",
    date: "Oct 28, 2025",
    readTime: "7 min read",
    image: "/placeholder.svg?height=400&width=600",
    slug: "chettinad-cuisine",
  },
];

const categories = ["All", "Recipes", "Health", "Story", "Culture", "Behind the Scenes"];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-96 h-96 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative text-center">
          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">
            Our Stories
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            The Kumaran <span className="text-[#b8860b]">Blog</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl mx-auto">
            Recipes, cooking tips, cultural stories, and behind-the-scenes looks
            at how we bring authentic South Indian flavors to your table.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-6 border-y border-[#b8860b]/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  category === "All"
                    ? "bg-[#b8860b] text-[#0d1f14] font-semibold"
                    : "border border-[#b8860b]/30 text-[#f5f0e1]/70 hover:border-[#b8860b]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 overflow-hidden hover:border-[#b8860b]/30 transition-colors"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#b8860b] text-[#0d1f14] text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-[#f5f0e1]/50 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold mb-3 group-hover:text-[#b8860b] transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-[#f5f0e1]/60 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#b8860b] font-semibold text-sm group-hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-[#b8860b]/50 text-[#f5f0e1] rounded-full hover:border-[#b8860b] transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">
            Get Recipes in Your Inbox
          </h2>
          <p className="text-[#f5f0e1]/60 mb-6">
            Subscribe to our newsletter for weekly recipes, cooking tips, and
            exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-full text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
            />
            <button className="px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
