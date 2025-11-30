import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import {
  Store,
  TrendingUp,
  Package,
  Users,
  CheckCircle,
  ArrowRight,
  Building2,
  Truck,
  BadgePercent,
  HeadphonesIcon,
} from "lucide-react";

export const metadata = {
  title: "Wholesale | House of Kumaran - Bulk Orders for Businesses",
  description:
    "Partner with House of Kumaran for wholesale orders. Authentic South Indian products for restaurants, retailers, and corporate gifting.",
};

const benefits = [
  {
    icon: BadgePercent,
    title: "Competitive Pricing",
    description: "Volume-based discounts that help maximize your margins",
  },
  {
    icon: Package,
    title: "Consistent Quality",
    description: "Same authentic taste in every batch, guaranteed",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    description: "Timely deliveries with dedicated logistics support",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Personal account manager for all your needs",
  },
];

const partnerTypes = [
  {
    icon: Store,
    title: "Retail Stores",
    description:
      "Stock authentic South Indian products that your customers will love. Perfect for grocery stores, specialty food shops, and supermarkets.",
  },
  {
    icon: Building2,
    title: "Restaurants & Hotels",
    description:
      "Elevate your menu with our premium podis, pickles, and ready-to-use mixes. Consistent quality for consistent taste.",
  },
  {
    icon: Users,
    title: "Corporate Gifting",
    description:
      "Impress clients and employees with curated gift hampers of authentic South Indian delicacies.",
  },
  {
    icon: TrendingUp,
    title: "Distributors",
    description:
      "Join our distribution network and bring the taste of South India to more customers in your region.",
  },
];

export default function WholesalePage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-96 h-96 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">
            For Businesses
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Wholesale <span className="text-[#b8860b]">Partnership</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl mb-8">
            Partner with House of Kumaran for authentic South Indian products at
            wholesale prices. Quality you can trust, prices you&apos;ll love.
          </p>
          <Link
            href="#inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
          >
            Become a Partner
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">
            Why Partner With Us?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/10 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-[#b8860b]" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-[#f5f0e1]/60 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-4 text-center">
            Who We Work With
          </h2>
          <p className="text-[#f5f0e1]/60 text-center mb-12 max-w-xl mx-auto">
            Whether you&apos;re a small retailer or a large distributor, we have
            partnership options tailored to your needs.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {partnerTypes.map((type) => (
              <div
                key={type.title}
                className="flex gap-4 p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10"
              >
                <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0">
                  <type.icon className="w-6 h-6 text-[#b8860b]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">
            What You Get
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-xl mb-6">Product Categories</h3>
              <ul className="space-y-3">
                {[
                  "Traditional Podi Varieties (10+ types)",
                  "Pickles & Thokku (8+ varieties)",
                  "Sweets & Snacks",
                  "Ready-to-Mix Mixes",
                  "Vadams & Appalam",
                  "Custom Gift Hampers",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#b8860b]" />
                    <span className="text-[#f5f0e1]/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-6">Partnership Perks</h3>
              <ul className="space-y-3">
                {[
                  "Minimum order quantity from 50 units",
                  "Up to 30% discount on bulk orders",
                  "Free shipping on orders above ₹25,000",
                  "Custom packaging with your branding",
                  "Priority support and dedicated manager",
                  "Marketing materials and product training",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#b8860b]" />
                    <span className="text-[#f5f0e1]/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Start Your Partnership
            </h2>
            <p className="text-[#f5f0e1]/60">
              Fill out the form below and our wholesale team will get back to
              you within 24 hours.
            </p>
          </div>

          <form className="bg-[#1a472a]/20 rounded-3xl border border-[#b8860b]/10 p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Business Type *
              </label>
              <select
                required
                className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] focus:outline-none focus:border-[#b8860b] transition-colors"
              >
                <option value="">Select your business type</option>
                <option value="retail">Retail Store</option>
                <option value="restaurant">Restaurant / Hotel</option>
                <option value="corporate">Corporate Gifting</option>
                <option value="distributor">Distributor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Expected Monthly Volume
              </label>
              <select className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] focus:outline-none focus:border-[#b8860b] transition-colors">
                <option value="">Select expected volume</option>
                <option value="50-100">50-100 units</option>
                <option value="100-500">100-500 units</option>
                <option value="500-1000">500-1000 units</option>
                <option value="1000+">1000+ units</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your business and requirements..."
                className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 px-6 bg-[#b8860b]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold text-[#0d1f14] mb-4">
            Prefer to Talk?
          </h2>
          <p className="text-[#0d1f14]/70 mb-6">
            Call our wholesale team directly at{" "}
            <a href="tel:+919876543210" className="font-semibold underline">
              +91 98765 43210
            </a>
          </p>
          <p className="text-[#0d1f14]/60 text-sm">
            Available Monday - Saturday, 9 AM - 6 PM IST
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
