"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Heart,
  User,
  Loader2,
} from "lucide-react";

// Type for search results
interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: string;
}
import { Button } from "@/components/ui/button";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useAuth } from "@/lib/auth-context";
import { CartDrawer } from "@/components/cart-drawer";
import { WishlistDrawer } from "@/components/wishlist-drawer";
import { AuthDrawer } from "@/components/auth-drawer";
import { categories } from "@/lib/products";

// Quick category links for sticky nav
const quickCategoryLinks = categories.slice(0, 6);

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoryBar, setShowCategoryBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useShopifyCart();
  const { wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Search state
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.products || []);
      setTotalResults(data.total || 0);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputValue.trim()) {
        performSearch(searchInputValue.trim());
      } else {
        setSearchResults([]);
        setTotalResults(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInputValue, performSearch]);

  // Clear search state when closing
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchInputValue("");
    setSearchResults([]);
    setTotalResults(0);
  };

  // Handle search submission (Enter key or See All Results)
  const handleSearchSubmit = () => {
    if (searchInputValue.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchInputValue.trim())}`);
      handleCloseSearch();
    }
  };

  // Handle keyboard events in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    } else if (e.key === "Escape") {
      handleCloseSearch();
    }
  };

  // Handle clicking a search result
  const handleResultClick = (slug: string) => {
    router.push(`/product/${slug}`);
    handleCloseSearch();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowCategoryBar(window.scrollY > 300); // Show category bar after scrolling past hero
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0d1f14]/95 backdrop-blur-xl border-b border-[#2a4a35]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 md:h-20 max-w-[1400px] items-center justify-between px-4 md:px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-[#b8860b]/50 group-hover:border-[#b8860b] transition-colors">
              <Image
                src="/images/houseofkumaranlogo.png"
                alt="House Of Kumaran"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] tracking-[0.3em] text-[#b8860b] uppercase">
                House of
              </p>
              <h1 className="text-base md:text-lg font-serif font-bold text-[#f5f0e1] tracking-wide">
                KUMARAN
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-sm text-[#b8860b] font-semibold hover:text-[#d4a017] transition-colors tracking-wide uppercase"
            >
              Shop
            </Link>
            {["Collections", "Our Story", "Contact"].map((item) => (
              <Link
                key={item}
                href={
                  item === "Our Story"
                    ? "/about"
                    : item === "Collections"
                    ? "/collections"
                    : item === "Contact"
                    ? "/contact"
                    : `/#${item.toLowerCase().replace(" ", "-")}`
                }
                className="text-sm text-[#f5f0e1]/70 hover:text-[#f5f0e1] transition-colors tracking-wide uppercase"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#f5f0e1]/70 hover:text-[#f5f0e1] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-[#f5f0e1]/70 hover:text-[#f5f0e1] transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#b8860b] rounded-full text-[10px] flex items-center justify-center text-[#0d1f14] font-bold">
                  {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="relative p-2 text-[#f5f0e1]/70 hover:text-[#f5f0e1] transition-colors"
            >
              <User className="w-5 h-5" />
              {isAuthenticated && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#f5f0e1]/70 hover:text-[#f5f0e1] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#b8860b] rounded-full text-[10px] flex items-center justify-center text-[#0d1f14] font-bold animate-pulse">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
            <Link href="/shop">
              <Button className="hidden md:flex bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold px-4 md:px-6 rounded-full text-sm">
                Shop Now
              </Button>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#f5f0e1]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Sticky Category Bar - appears on scroll */}
        <div
          className={`hidden lg:block border-t border-[#2a4a35]/50 transition-all duration-300 ${
            showCategoryBar
              ? "opacity-100 max-h-12"
              : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="flex items-center justify-center gap-6 py-2">
              {quickCategoryLinks.map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop?category=${category.slug}`}
                  className="text-sm text-[#f5f0e1]/60 hover:text-[#b8860b] transition-colors tracking-wide uppercase whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/shop"
                className="text-sm text-[#b8860b] hover:text-[#d4a017] transition-colors tracking-wide uppercase whitespace-nowrap font-semibold"
              >
                All Products →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0d1f14]">
          <div className="flex items-center justify-between p-6">
            <p className="text-[#b8860b] tracking-[0.2em] uppercase text-sm">
              Menu
            </p>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#f5f0e1]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col items-start px-6 pt-8 gap-6">
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-serif text-[#b8860b] hover:text-[#d4a017] transition-colors"
            >
              Shop All
            </Link>

            {/* Mobile Category Links */}
            <div className="w-full pt-4 border-t border-[#2a4a35]">
              <p className="text-[#f5f0e1]/40 text-xs uppercase tracking-wider mb-4">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quickCategoryLinks.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/shop?category=${category.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg text-[#f5f0e1]/70 hover:text-[#b8860b] transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/collections"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg text-[#b8860b] hover:text-[#d4a017] transition-colors mt-4"
              >
                Browse All Collections →
              </Link>
            </div>

            <div className="w-full pt-4 border-t border-[#2a4a35]">
              {["Our Story", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={
                    item === "Our Story"
                      ? "/about"
                      : item === "Contact"
                      ? "/contact"
                      : `/#${item.toLowerCase().replace(" ", "-")}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl font-serif text-[#f5f0e1]/70 hover:text-[#f5f0e1] transition-colors py-2"
                >
                  {item}
                </Link>
              ))}
            </div>

            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4"
            >
              <Button className="bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold px-8 py-6 rounded-full text-lg">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0d1f14]/98 backdrop-blur-xl flex items-start justify-center pt-24 md:pt-32 overflow-y-auto">
          <div className="w-full max-w-2xl px-6 pb-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[#b8860b] tracking-[0.2em] uppercase text-sm">
                Search
              </p>
              <button
                onClick={handleCloseSearch}
                className="text-[#f5f0e1] hover:text-[#b8860b] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="What are you looking for?"
                autoFocus
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-transparent border-b-2 border-[#2a4a35] focus:border-[#b8860b] py-4 text-2xl md:text-3xl font-serif text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 outline-none transition-colors pr-12"
              />
              {isSearching && (
                <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-[#b8860b] animate-spin" />
              )}
            </div>

            {/* Live Search Results */}
            {searchInputValue.length >= 2 && (
              <div className="mt-6">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#b8860b] animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[#f5f0e1]/50 text-sm mb-4">
                      Found {totalResults} {totalResults === 1 ? "product" : "products"}
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleResultClick(product.slug)}
                          className="w-full flex items-center gap-4 p-3 rounded-lg bg-[#1a472a]/30 hover:bg-[#1a472a]/50 border border-[#2a4a35] hover:border-[#b8860b]/50 transition-all group text-left"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a472a]">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[#f5f0e1] font-medium truncate group-hover:text-[#b8860b] transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#b8860b]/10 text-[#b8860b] capitalize">
                                {product.category}
                              </span>
                              <span className="text-[#f5f0e1]/60 text-sm">
                                ₹{product.price}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#f5f0e1]/30 group-hover:text-[#b8860b] transition-colors flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                    {totalResults > 6 && (
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full mt-4 py-3 text-center text-[#b8860b] hover:text-[#d4a017] font-medium transition-colors border border-[#b8860b]/30 hover:border-[#b8860b] rounded-lg"
                      >
                        See all {totalResults} results →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#f5f0e1]/50">
                      No products found for &quot;{searchInputValue}&quot;
                    </p>
                    <p className="text-[#f5f0e1]/30 text-sm mt-2">
                      Try different keywords or browse categories below
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Popular Searches - Show when no search input */}
            {searchInputValue.length < 2 && (
              <>
                <div className="mt-12">
                  <p className="text-[#f5f0e1]/50 text-sm mb-4">Popular searches</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Idly Podi",
                      "Mysore Pak",
                      "Pickle",
                      "Murukku",
                      "Sambar Podi",
                    ].map((term) => (
                      <Link
                        key={term}
                        href={`/shop?search=${encodeURIComponent(term)}`}
                        onClick={handleCloseSearch}
                        className="px-4 py-2 border border-[#2a4a35] rounded-full text-[#f5f0e1]/70 hover:border-[#b8860b] hover:text-[#b8860b] transition-colors"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
                {/* Quick category access in search */}
                <div className="mt-8">
                  <p className="text-[#f5f0e1]/50 text-sm mb-4">
                    Browse categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickCategoryLinks.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/shop?category=${category.slug}`}
                        onClick={handleCloseSearch}
                        className="px-4 py-2 bg-[#1a472a]/50 rounded-full text-[#f5f0e1]/70 hover:bg-[#b8860b]/20 hover:text-[#b8860b] transition-colors text-sm"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      {/* Auth Drawer */}
      <AuthDrawer
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onOpenWishlist={() => {
          setIsAuthOpen(false);
          setIsWishlistOpen(true);
        }}
      />
    </>
  );
}
