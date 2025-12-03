"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ChevronDown, Search, HelpCircle, MessageSquare } from "lucide-react";

const faqCategories = [
  {
    id: "orders",
    name: "Orders & Shipping",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Delivery times vary by location: South India (2-4 days), West & Central India (4-6 days), North India (5-7 days), and East/Northeast India (7-10 days). Orders placed before 2 PM are dispatched the same day.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free shipping on all orders above ₹500. For orders below ₹500, shipping charges vary from ₹50 to ₹100 depending on your location.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely! Once your order is shipped, you'll receive an SMS and email with tracking details. You can also track your order on our Track Order page using your order number.",
      },
      {
        q: "Do you deliver to all parts of India?",
        a: "Yes, we deliver to all 28 states and 8 union territories across India. However, we currently do not ship internationally.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, Credit/Debit Cards, Net Banking, Wallets, and Cash on Delivery (COD) for orders up to ₹5000.",
      },
    ],
  },
  {
    id: "products",
    name: "Products & Quality",
    faqs: [
      {
        q: "Are your products preservative-free?",
        a: "Yes! All our products are made with zero artificial preservatives, colors, or flavors. We use traditional methods and natural ingredients to ensure authentic taste and longer shelf life.",
      },
      {
        q: "What is the shelf life of your products?",
        a: "Shelf life varies by product: Podis (6-8 months), Pickles (8-12 months), Sweets (2-3 weeks), Savouries (2-3 months), Vadams (6-8 months). Always check the packaging for specific dates.",
      },
      {
        q: "How should I store the products?",
        a: "Store podis and pickles in a cool, dry place. After opening, keep them refrigerated for longer freshness. Sweets should be consumed within a week of opening. Always use a dry spoon.",
      },
      {
        q: "Are your products vegetarian?",
        a: "Most of our products are 100% vegetarian. Products containing non-vegetarian ingredients are clearly labeled. Look for the green dot (veg) or red dot (non-veg) on packaging.",
      },
      {
        q: "Do you use any artificial ingredients?",
        a: "No, we never use artificial colors, flavors, or preservatives. Our recipes use only traditional, natural ingredients just like homemade food.",
      },
    ],
  },
  {
    id: "returns",
    name: "Returns & Refunds",
    faqs: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for damaged, defective, or wrong items. Due to the nature of food products, we cannot accept returns for change of mind.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email us at support@houseofkumaran.com with your order number, photos of the issue, and reason for return. Our team will respond within 24-48 hours.",
      },
      {
        q: "How long do refunds take?",
        a: "Once approved, refunds are processed within 5-7 business days. Credit/Debit card refunds may take 5-10 days to reflect, while UPI refunds are faster (2-3 days).",
      },
      {
        q: "Can I exchange a product?",
        a: "Yes, we offer free replacements for damaged or defective products. Contact us within 7 days of delivery with photos of the issue.",
      },
    ],
  },
  {
    id: "account",
    name: "Account & Orders",
    faqs: [
      {
        q: "Do I need an account to order?",
        a: "No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, and earn rewards on purchases.",
      },
      {
        q: "How can I modify or cancel my order?",
        a: "You can modify or cancel your order within 2 hours of placing it by contacting us. Once shipped, orders cannot be cancelled.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click on 'Forgot Password' on the login page and enter your registered email. You'll receive a password reset link within minutes.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentCategory = faqCategories.find((c) => c.id === activeCategory);

  const filteredFaqs = searchQuery
    ? faqCategories.flatMap((cat) =>
        cat.faqs.filter(
          (faq) =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : currentCategory?.faqs || [];

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-96 h-96 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b8860b]/10 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[#b8860b] text-sm font-medium">
              Help Center
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Frequently Asked <span className="text-[#b8860b]">Questions</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our products, orders,
            shipping, and more.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f5f0e1]/40" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1a472a]/30 border border-[#b8860b]/20 rounded-full text-[#f5f0e1] placeholder:text-[#f5f0e1]/40 focus:outline-none focus:border-[#b8860b] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Sidebar */}
            {!searchQuery && (
              <div className="lg:w-64 flex-shrink-0">
                <div className="lg:sticky lg:top-24 space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        activeCategory === category.id
                          ? "bg-[#b8860b] text-[#0d1f14] font-semibold"
                          : "text-[#f5f0e1]/70 hover:bg-[#1a472a]/30"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ List */}
            <div className="flex-1">
              {searchQuery && (
                <p className="text-[#f5f0e1]/60 mb-6">
                  Showing {filteredFaqs.length} results for &quot;{searchQuery}
                  &quot;
                </p>
              )}

              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const faqId = `${activeCategory}-${index}`;
                  const isOpen = openFaq === faqId;

                  return (
                    <div
                      key={faqId}
                      className="bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : faqId)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-semibold pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#b8860b] flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <p className="text-[#f5f0e1]/70 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#f5f0e1]/60 mb-4">
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#b8860b] hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b8860b]/10 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[#b8860b] text-sm font-medium">
              Still have questions?
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-[#f5f0e1]/60 mb-8 max-w-xl mx-auto">
            Our support team is always happy to help. Reach out to us and
            we&apos;ll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
            >
              Contact Support
            </Link>
            <a
              href="https://wa.me/918667262327"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#b8860b]/50 text-[#f5f0e1] rounded-full hover:border-[#b8860b] transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
