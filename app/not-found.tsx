import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Home, Search, ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      <section className="pt-32 pb-20 px-6 min-h-[70vh] flex items-center">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto">
            {/* 404 Number */}
            <div className="relative mb-8">
              <p className="text-[150px] md:text-[200px] font-serif font-bold text-[#1a472a] leading-none select-none">
                404
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#b8860b]/10 flex items-center justify-center">
                  <Search className="w-12 h-12 text-[#b8860b]" />
                </div>
              </div>
            </div>

            {/* Message */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-[#f5f0e1]/60 text-lg mb-8">
              The page you&apos;re looking for seems to have wandered off like a
              lost papadum. Let&apos;s get you back to the delicious stuff!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#b8860b]/50 text-[#f5f0e1] rounded-full hover:border-[#b8860b] transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-[#b8860b]/10">
              <p className="text-[#f5f0e1]/40 text-sm mb-4">
                Here are some helpful links:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link
                  href="/shop?category=podis"
                  className="text-[#b8860b] hover:underline"
                >
                  Podis
                </Link>
                <Link
                  href="/shop?category=pickles"
                  className="text-[#b8860b] hover:underline"
                >
                  Pickles
                </Link>
                <Link
                  href="/shop?category=sweets"
                  className="text-[#b8860b] hover:underline"
                >
                  Sweets
                </Link>
                <Link
                  href="/contact"
                  className="text-[#b8860b] hover:underline"
                >
                  Contact Us
                </Link>
                <Link href="/faqs" className="text-[#b8860b] hover:underline">
                  FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
