"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { categories } from "@/lib/products";

// Quick category links for sticky nav
const quickCategoryLinks = categories.slice(0, 6);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoryBar, setShowCategoryBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen, isCartOpen } = useCart();

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
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#b8860b]/50 group-hover:border-[#b8860b] transition-colors">
              <Image
                src="/images/houseofkumaranlogo.jpeg"
                alt="House Of Kumaran"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] tracking-[0.3em] text-[#b8860b] uppercase">
                Made in Madras
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
                  className="text-xs text-[#f5f0e1]/60 hover:text-[#b8860b] transition-colors tracking-wide uppercase whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/shop"
                className="text-xs text-[#b8860b] hover:text-[#d4a017] transition-colors tracking-wide uppercase whitespace-nowrap font-semibold"
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
        <div className="fixed inset-0 z-[60] bg-[#0d1f14]/98 backdrop-blur-xl flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl px-6">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[#b8860b] tracking-[0.2em] uppercase text-sm">
                Search
              </p>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-[#f5f0e1]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="What are you looking for?"
                autoFocus
                className="w-full bg-transparent border-b-2 border-[#2a4a35] focus:border-[#b8860b] py-4 text-2xl md:text-3xl font-serif text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 outline-none transition-colors"
              />
            </div>
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
                    onClick={() => setIsSearchOpen(false)}
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
                    onClick={() => setIsSearchOpen(false)}
                    className="px-4 py-2 bg-[#1a472a]/50 rounded-full text-[#f5f0e1]/70 hover:bg-[#b8860b]/20 hover:text-[#b8860b] transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
