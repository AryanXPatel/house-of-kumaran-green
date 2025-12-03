"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { RecentlyViewed } from "@/components/recently-viewed";
import { Product, CategoryInfo } from "@/lib/types";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  Leaf,
  Zap,
  Heart,
  Truck,
} from "lucide-react";

type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

const quickTags = [
  { id: "bestseller", label: "Bestseller", icon: Award },
  { id: "new", label: "New", icon: Sparkles },
  { id: "traditional", label: "Traditional", icon: Leaf },
  { id: "spicy", label: "Spicy", icon: Flame },
  { id: "healthy", label: "Healthy", icon: Heart },
  { id: "protein-rich", label: "High Protein", icon: Zap },
];

// Loading skeleton component
function ProductSkeleton() {
  return (
    <div className="bg-[#1a472a]/30 rounded-xl overflow-hidden border border-[#b8860b]/10 animate-pulse">
      <div className="aspect-square bg-[#1a472a]/50" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-[#1a472a]/50 rounded" />
          <div className="w-12 h-3 bg-[#1a472a]/50 rounded" />
        </div>
        <div className="w-3/4 h-4 bg-[#1a472a]/50 rounded" />
        <div className="w-1/2 h-3 bg-[#1a472a]/50 rounded" />
        <div className="flex items-center justify-between pt-2">
          <div className="w-16 h-5 bg-[#1a472a]/50 rounded" />
          <div className="w-8 h-8 bg-[#1a472a]/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Loading fallback component for Suspense
function ShopPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />
      <section className="pt-28 pb-6 px-6 border-b border-[#b8860b]/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="h-4 w-32 bg-[#1a472a]/50 rounded mb-6 animate-pulse" />
          <div className="h-10 w-64 bg-[#1a472a]/50 rounded mb-2 animate-pulse" />
          <div className="h-4 w-24 bg-[#1a472a]/50 rounded animate-pulse" />
        </div>
      </section>
      <section className="py-8 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

// Wrap the shop content in Suspense
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter values from URL
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const sortParam = (searchParams.get("sort") as SortOption) || "featured";
  const tagParam = searchParams.get("tag") || "";
  const minPriceParam = Number(searchParams.get("minPrice")) || 0;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || 500;

  // Local state
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [selectedTag, setSelectedTag] = useState(tagParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam,
    maxPriceParam,
  ]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  // Fetch products and categories from Shopify/static
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { getProducts, getCategoriesWithCounts } = await import(
          "@/lib/product-service"
        );
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategoriesWithCounts(),
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to static data
        const { products: staticProducts, categories: staticCategories } =
          await import("@/lib/products");
        setProducts(staticProducts);
        setCategories(staticCategories);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Sync state with URL params on mount and URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchQuery(searchParam);
    setSortBy(sortParam);
    setSelectedTag(tagParam);
    setPriceRange([minPriceParam, maxPriceParam]);
  }, [
    categoryParam,
    searchParam,
    sortParam,
    tagParam,
    minPriceParam,
    maxPriceParam,
  ]);

  // Update URL when filters change
  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter(
        (p) =>
          p.tags.some((tag) =>
            tag.toLowerCase().includes(selectedTag.toLowerCase())
          ) ||
          (selectedTag === "bestseller" && p.isBestseller) ||
          (selectedTag === "new" && p.isNew)
      );
    }

    // Filter by price
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return a.isNew ? -1 : 1;
        default:
          return a.isBestseller ? -1 : 1;
      }
    });

    return result;
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedTag,
    priceRange,
    sortBy,
  ]);

  // Get category name for display
  const currentCategoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name
    : "All Products";

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setPriceRange([0, 500]);
    setSortBy("featured");
    router.push("/shop", { scroll: false });
  };

  const hasActiveFilters =
    selectedCategory ||
    searchQuery ||
    selectedTag ||
    priceRange[0] > 0 ||
    priceRange[1] < 500;
  const activeFilterCount = [
    selectedCategory,
    selectedTag,
    priceRange[0] > 0 || priceRange[1] < 500,
  ].filter(Boolean).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSortDropdown(false);
    if (showSortDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showSortDropdown]);

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Shipping Info Banner - positioned after navbar space */}
      <div className="pt-16 md:pt-20">
        <div className="bg-gradient-to-r from-[#1a472a] via-[#0d1f14] to-[#1a472a] border-b border-[#b8860b]/10">
          <div className="max-w-[1400px] mx-auto px-6 py-3">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-[#b8860b]">
                <Truck className="w-4 h-4" />
                <span className="font-medium">FREE Shipping</span>
                <span className="text-[#f5f0e1]/60">on orders ₹500+</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-[#b8860b]/30" />
              <div className="hidden sm:flex items-center gap-2 text-[#f5f0e1]/60">
                <span>Standard Delivery:</span>
                <span className="text-[#f5f0e1] font-medium">₹80</span>
                <span>(orders below ₹500)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="pt-6 pb-6 px-6 border-b border-[#b8860b]/10">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/"
              className="text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
            <span className="text-[#b8860b]">Shop</span>
            {selectedCategory && (
              <>
                <ChevronRight className="w-4 h-4 text-[#f5f0e1]/30" />
                <span className="text-[#f5f0e1]">{currentCategoryName}</span>
              </>
            )}
          </nav>

          {/* Title & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-1">
                {currentCategoryName}
              </h1>
              <p className="text-[#f5f0e1]/60 text-sm">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f5f0e1]/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateURL({ search: searchQuery });
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a472a]/30 border border-[#b8860b]/20 rounded-lg text-sm text-[#f5f0e1] placeholder:text-[#f5f0e1]/40 focus:outline-none focus:border-[#b8860b]/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    updateURL({ search: "" });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f5f0e1]/40 hover:text-[#f5f0e1]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f5f0e1]/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateURL({ search: searchQuery });
                }
              }}
              className="w-full pl-10 pr-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/20 rounded-lg text-sm text-[#f5f0e1] placeholder:text-[#f5f0e1]/40 focus:outline-none focus:border-[#b8860b]/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Mobile Filter/Sort Buttons */}
      <section className="lg:hidden sticky top-16 z-30 py-3 px-6 bg-[#0d1f14] border-b border-[#b8860b]/10">
        <div className="flex gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#b8860b]/30 rounded-lg hover:border-[#b8860b]/50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#b8860b]" />
            <span className="text-sm font-medium">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#b8860b] text-[#0d1f14] text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowMobileSort(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#b8860b]/30 rounded-lg hover:border-[#b8860b]/50 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4 text-[#b8860b]" />
            <span className="text-sm font-medium">Sort</span>
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        updateURL({ category: "" });
                      }}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm transition-colors ${
                        !selectedCategory
                          ? "bg-[#b8860b]/10 text-[#b8860b] font-medium"
                          : "text-[#f5f0e1]/70 hover:text-[#f5f0e1] hover:bg-[#1a472a]/30"
                      }`}
                    >
                      <span>All Products</span>
                      <span className="text-[#f5f0e1]/30">
                        {products.length}
                      </span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          updateURL({ category: cat.slug });
                        }}
                        className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.slug
                            ? "bg-[#b8860b]/10 text-[#b8860b] font-medium"
                            : "text-[#f5f0e1]/70 hover:text-[#f5f0e1] hover:bg-[#1a472a]/30"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[#f5f0e1]/30">
                          {cat.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full accent-[#b8860b] cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#f5f0e1]/70">
                        ₹{priceRange[0]}
                      </span>
                      <span className="text-[#f5f0e1]/70">
                        ₹{priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Filters */}
                <div>
                  <h3 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">
                    Quick Filters
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {quickTags.map((tag) => {
                      const Icon = tag.icon;
                      return (
                        <button
                          key={tag.id}
                          onClick={() => {
                            const newTag = selectedTag === tag.id ? "" : tag.id;
                            setSelectedTag(newTag);
                            updateURL({ tag: newTag });
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-colors ${
                            selectedTag === tag.id
                              ? "bg-[#b8860b] text-[#0d1f14] font-medium"
                              : "border border-[#b8860b]/20 text-[#f5f0e1]/70 hover:border-[#b8860b] hover:text-[#b8860b]"
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Desktop Sort Bar */}
              <div className="hidden lg:flex items-center justify-end mb-6">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSortDropdown(!showSortDropdown);
                    }}
                    className="flex items-center gap-2 text-sm text-[#f5f0e1]/70 hover:text-[#f5f0e1] transition-colors"
                  >
                    <span>Sort by:</span>
                    <span className="font-medium text-[#f5f0e1]">
                      {sortOptions.find((o) => o.value === sortBy)?.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showSortDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showSortDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a472a] border border-[#b8860b]/20 rounded-lg overflow-hidden z-20 shadow-xl">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                            updateURL({ sort: option.value });
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#b8860b]/10 transition-colors ${
                            sortBy === option.value
                              ? "text-[#b8860b] bg-[#b8860b]/5"
                              : "text-[#f5f0e1]/70"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a472a]/30 flex items-center justify-center">
                    <Search className="w-10 h-10 text-[#b8860b]/50" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#f5f0e1] mb-2">
                    No products found
                  </h3>
                  <p className="text-[#f5f0e1]/50 mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category CTA */}
      <section className="py-12 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-[#f5f0e1]/60 mb-2">
            Looking for something specific?
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-[#b8860b] hover:text-[#d4a017] font-semibold transition-colors"
          >
            Browse All Collections
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      <Footer />

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#0d1f14] rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* Handle */}
            <div className="sticky top-0 bg-[#0d1f14] pt-3 pb-4 px-6 border-b border-[#b8860b]/10">
              <div className="w-12 h-1 bg-[#f5f0e1]/20 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6 text-[#f5f0e1]/70" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">
                  Categories
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      updateURL({ category: "" });
                    }}
                    className={`py-3 px-4 rounded-lg text-sm text-left transition-colors ${
                      !selectedCategory
                        ? "bg-[#b8860b] text-[#0d1f14] font-semibold"
                        : "border border-[#b8860b]/30 text-[#f5f0e1]/70"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        updateURL({ category: cat.slug });
                      }}
                      className={`py-3 px-4 rounded-lg text-sm text-left transition-colors ${
                        selectedCategory === cat.slug
                          ? "bg-[#b8860b] text-[#0d1f14] font-semibold"
                          : "border border-[#b8860b]/30 text-[#f5f0e1]/70"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">
                  Price Range
                </h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full accent-[#b8860b]"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#f5f0e1]/70">₹{priceRange[0]}</span>
                    <span className="text-[#f5f0e1]/70">₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="text-sm font-bold text-[#b8860b] tracking-wider uppercase mb-4">
                  Quick Filters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {quickTags.map((tag) => {
                    const Icon = tag.icon;
                    return (
                      <button
                        key={tag.id}
                        onClick={() => {
                          const newTag = selectedTag === tag.id ? "" : tag.id;
                          setSelectedTag(newTag);
                          updateURL({ tag: newTag });
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-colors ${
                          selectedTag === tag.id
                            ? "bg-[#b8860b] text-[#0d1f14] font-medium"
                            : "border border-[#b8860b]/30 text-[#f5f0e1]/70"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 p-6 bg-[#0d1f14] border-t border-[#b8860b]/10 flex gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-[#b8860b]/30 rounded-full text-[#f5f0e1] font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Drawer */}
      {showMobileSort && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileSort(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#0d1f14] rounded-t-3xl animate-slide-up">
            {/* Handle */}
            <div className="pt-3 pb-4 px-6 border-b border-[#b8860b]/10">
              <div className="w-12 h-1 bg-[#f5f0e1]/20 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold">Sort By</h3>
                <button onClick={() => setShowMobileSort(false)}>
                  <X className="w-6 h-6 text-[#f5f0e1]/70" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    updateURL({ sort: option.value });
                    setShowMobileSort(false);
                  }}
                  className={`w-full flex items-center justify-between py-4 px-4 rounded-lg mb-1 transition-colors ${
                    sortBy === option.value
                      ? "bg-[#b8860b]/10 text-[#b8860b]"
                      : "text-[#f5f0e1]/70"
                  }`}
                >
                  <span className="text-base">{option.label}</span>
                  {sortBy === option.value && (
                    <div className="w-5 h-5 rounded-full bg-[#b8860b] flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-[#0d1f14]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
