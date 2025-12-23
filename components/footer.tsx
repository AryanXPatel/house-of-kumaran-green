"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  CheckCircle,
  Loader2,
  Crown,
  Percent,
  Sparkles,
  Gift,
  Users,
} from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Podi Varieties", href: "/category/podi" },
    { name: "Pickles & Thokku", href: "/category/pickles" },
    { name: "Sweets", href: "/category/sweets" },
    { name: "Savouries", href: "/category/savouries" },
    { name: "Vadam & Appalam", href: "/category/vadam" },
    { name: "Ready-To-Mix", href: "/category/ready-mix" },
  ],
  company: [
    { name: "Our Story", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Wholesale", href: "/wholesale" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "FAQs", href: "/faqs" },
    { name: "Track Order", href: "/track" },
  ],
};

const socialLinks = [
  {
    icon: Instagram,
    href: "https://instagram.com/houseofkumaran",
    label: "Instagram",
  },
  {
    icon: Facebook,
    href: "https://facebook.com/houseofkumaran",
    label: "Facebook",
  },
  {
    icon: Youtube,
    href: "https://youtube.com/@houseofkumaran",
    label: "YouTube",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/houseofkumaran",
    label: "Twitter",
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubscribeStatus("idle");

    try {
      // Subscribe via Shopify Admin API
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setSubscribeStatus("success");
        setEmail("");
      } else {
        console.error("Newsletter subscription failed:", result.error);
        setSubscribeStatus("error");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubscribeStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-[#0a1810] pt-24 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2a4a35] to-transparent" />

      {/* Newsletter section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#132a1c] to-[#0d1f14] border border-[#b8860b]/30 p-8 md:p-12 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #f5f0e1 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          {/* Golden accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent" />

          <div className="relative">
            {/* Header with icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4a017] flex items-center justify-center shadow-lg shadow-[#b8860b]/20">
                <Crown className="w-7 h-7 text-[#0d1f14]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#f5f0e1]">
                  Join the Kumaran Family
                </h3>
                <p className="text-[#b8860b] text-sm font-medium">
                  Unlock exclusive member benefits
                </p>
              </div>
            </div>

            {/* Benefits grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Percent, text: "5% OFF forever" },
                { icon: Sparkles, text: "Early access" },
                { icon: Gift, text: "Exclusive recipes" },
                { icon: Crown, text: "Member offers" },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 bg-[#b8860b]/10 rounded-xl border border-[#b8860b]/20"
                >
                  <benefit.icon className="w-4 h-4 text-[#b8860b]" />
                  <span className="text-[#f5f0e1]/80 text-sm font-medium">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Form and social proof row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {subscribeStatus === "success" ? (
                <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 rounded-full text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Welcome to the Kumaran Family!</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 flex-1"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="flex-1 lg:max-w-sm px-6 py-4 bg-[#0d1f14] border border-[#2a4a35] rounded-full text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-[#b8860b] to-[#d4a017] hover:from-[#d4a017] hover:to-[#b8860b] text-[#0d1f14] font-bold rounded-full transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#b8860b]/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Free"
                    )}
                  </button>
                </form>
              )}

              {/* Social proof */}
              <div className="flex items-center gap-2 text-[#f5f0e1]/50 lg:border-l lg:border-[#2a4a35] lg:pl-6">
                <Users className="w-4 h-4 text-[#b8860b]" />
                <span className="text-sm">10,000+ families joined</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Logo & description */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 min-w-[56px] rounded-full overflow-hidden border-2 border-[#b8860b]/30 flex-shrink-0">
                <Image
                  src="/images/houseofkumaranlogo.png"
                  alt="House Of Kumaran"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  priority
                  unoptimized
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-[#b8860b] uppercase">
                  Made in Madras
                </p>
                <h2 className="font-serif text-xl font-bold text-[#f5f0e1]">
                  KUMARAN
                </h2>
              </div>
            </Link>
            <p className="text-[#f5f0e1]/50 leading-relaxed mb-6 max-w-sm">
              Authentic South Indian flavors crafted with tradition, love, and
              zero preservatives. From our kitchen to yours.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-[#f5f0e1]/50 text-sm">
              <p>3, Kasthuri 2nd Street, New Lakshmipuram</p>
              <p>Chennai, Tamil Nadu - 600099</p>
              <p>hello@houseofkumaran.com</p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[#b8860b] text-xs tracking-[0.2em] uppercase mb-6">
              Shop
            </h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#f5f0e1]/60 hover:text-[#f5f0e1] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#b8860b] text-xs tracking-[0.2em] uppercase mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#f5f0e1]/60 hover:text-[#f5f0e1] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#b8860b] text-xs tracking-[0.2em] uppercase mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#f5f0e1]/60 hover:text-[#f5f0e1] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[#b8860b] text-xs tracking-[0.2em] uppercase mb-6">
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#2a4a35] flex items-center justify-center text-[#f5f0e1]/60 hover:border-[#b8860b] hover:text-[#b8860b] transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>

            {/* Payment methods hint */}
            <div className="mt-8">
              <p className="text-[#f5f0e1]/30 text-xs mb-3">We accept</p>
              <div className="flex gap-2 text-[#f5f0e1]/40 text-xs">
                <span className="px-2 py-1 border border-[#2a4a35] rounded">
                  UPI
                </span>
                <span className="px-2 py-1 border border-[#2a4a35] rounded">
                  Cards
                </span>
                <span className="px-2 py-1 border border-[#2a4a35] rounded">
                  COD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2a4a35]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#f5f0e1]/40 text-sm">
              © {new Date().getFullYear()} House of Kumaran. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-[#f5f0e1]/40 hover:text-[#f5f0e1] text-sm transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Large brand text */}
      <div className="relative h-24 overflow-hidden border-t border-[#2a4a35]">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-serif text-[8vw] font-bold text-[#1a2a20] whitespace-nowrap select-none">
            HOUSE OF KUMARAN
          </p>
        </div>
      </div>
    </footer>
  );
}
