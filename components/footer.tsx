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
      // Using Web3Forms for newsletter signup
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "73b5ab25-d66d-44b5-a914-aa6e5dedf83d", // Replace with actual key from web3forms.com
          subject: "New Newsletter Subscription - Kumaran Family",
          email: email,
          message: `New subscriber: ${email} wants to join the Kumaran Family!`,
          to: "support@houseofkumaran.com",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubscribeStatus("success");
        setEmail("");
      } else {
        // Fallback - open mailto
        window.location.href = `mailto:hello@houseofkumaran.com?subject=Newsletter%20Subscription&body=Please%20add%20me%20to%20your%20newsletter:%20${encodeURIComponent(
          email
        )}`;
        setSubscribeStatus("success");
        setEmail("");
      }
    } catch {
      // Fallback - open mailto
      window.location.href = `mailto:hello@houseofkumaran.com?subject=Newsletter%20Subscription&body=Please%20add%20me%20to%20your%20newsletter:%20${encodeURIComponent(
        email
      )}`;
      setSubscribeStatus("success");
      setEmail("");
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
        <div className="relative rounded-3xl bg-[#132a1c] border border-[#2a4a35] p-10 md:p-16 overflow-hidden">
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

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#f5f0e1] mb-4">
                Join the Kumaran Family
              </h3>
              <p className="text-[#f5f0e1]/60">
                Subscribe for exclusive offers, recipes, and 5% off on all
                orders forever.
              </p>
            </div>

            {subscribeStatus === "success" ? (
              <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 rounded-full text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Welcome to the Kumaran Family!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="flex-1 lg:w-80 px-6 py-4 bg-[#0d1f14] border border-[#2a4a35] rounded-full text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Logo & description */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#b8860b]/30">
                <Image
                  src="/images/houseofkumaranlogo.png"
                  alt="House Of Kumaran"
                  width={56}
                  height={56}
                  className="object-cover"
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
              <p>3, Kasthuri 2nd Street, New Laxmipuram</p>
              <p>Chennai, Tamil Nadu - 600099</p>
              <p>hello@houseofkumaran.com</p>
              <p>+91 93370 54587</p>
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
