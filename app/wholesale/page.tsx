"use client";

import { useState } from "react";
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
  Loader2,
} from "lucide-react";

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
  const [formData, setFormData] = useState({
    contactName: "",
    businessName: "",
    email: "",
    phone: "",
    businessType: "",
    volume: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Using Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "73b5ab25-d66d-44b5-a914-aa6e5dedf83d", // Replace with actual key
          from_name: formData.contactName,
          subject: `Wholesale Inquiry from ${formData.businessName}`,
          email: formData.email,
          phone: formData.phone,
          business_name: formData.businessName,
          business_type: formData.businessType,
          expected_volume: formData.volume || "Not specified",
          message: formData.message || "No additional message",
          to: "support@houseofkumaran.com",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setFormData({
          contactName: "",
          businessName: "",
          email: "",
          phone: "",
          businessType: "",
          volume: "",
          message: "",
        });
      } else {
        // Fallback to mailto
        const mailtoLink = `mailto:support@houseofkumaran.com?subject=${encodeURIComponent(
          `Wholesale Inquiry from ${formData.businessName}`
        )}&body=${encodeURIComponent(
          `Contact Name: ${formData.contactName}\nBusiness Name: ${
            formData.businessName
          }\nEmail: ${formData.email}\nPhone: ${
            formData.phone
          }\nBusiness Type: ${formData.businessType}\nExpected Volume: ${
            formData.volume || "Not specified"
          }\n\nMessage:\n${formData.message || "No additional message"}`
        )}`;
        window.location.href = mailtoLink;
        setSubmitStatus("success");
      }
    } catch {
      // Fallback to mailto
      const mailtoLink = `mailto:support@houseofkumaran.com?subject=${encodeURIComponent(
        `Wholesale Inquiry from ${formData.businessName}`
      )}&body=${encodeURIComponent(
        `Contact Name: ${formData.contactName}\nBusiness Name: ${
          formData.businessName
        }\nEmail: ${formData.email}\nPhone: ${formData.phone}\nBusiness Type: ${
          formData.businessType
        }\nExpected Volume: ${
          formData.volume || "Not specified"
        }\n\nMessage:\n${formData.message || "No additional message"}`
      )}`;
      window.location.href = mailtoLink;
      setSubmitStatus("success");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {submitStatus === "success" ? (
            <div className="bg-[#1a472a]/20 rounded-3xl border border-[#b8860b]/10 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">
                Inquiry Submitted!
              </h3>
              <p className="text-[#f5f0e1]/60 mb-6">
                Thank you for your interest in partnering with House of Kumaran.
                Our wholesale team will contact you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="px-6 py-2 border border-[#b8860b]/30 rounded-full text-[#b8860b] hover:bg-[#b8860b]/10 transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[#1a472a]/20 rounded-3xl border border-[#b8860b]/10 p-8 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
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
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] focus:outline-none focus:border-[#b8860b] transition-colors"
                >
                  <option value="">Select your business type</option>
                  <option value="Retail Store">Retail Store</option>
                  <option value="Restaurant / Hotel">Restaurant / Hotel</option>
                  <option value="Corporate Gifting">Corporate Gifting</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Monthly Volume
                </label>
                <select
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] focus:outline-none focus:border-[#b8860b] transition-colors"
                >
                  <option value="">Select expected volume</option>
                  <option value="50-100 units">50-100 units</option>
                  <option value="100-500 units">100-500 units</option>
                  <option value="500-1000 units">500-1000 units</option>
                  <option value="1000+ units">1000+ units</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your business and requirements..."
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </button>
            </form>
          )}
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
            <a href="tel:+919337054587" className="font-semibold underline">
              +91 93370 54587
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
