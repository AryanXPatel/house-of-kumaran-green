import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Returns & Refunds | House of Kumaran",
  description:
    "Learn about House of Kumaran's return policy, refund process, and how to return or exchange your orders.",
};

export default function ReturnsPage() {
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
            Our Policy
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Returns & <span className="text-[#b8860b]">Refunds</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl">
            Your satisfaction is our priority. If you&apos;re not happy with
            your purchase, we&apos;re here to make it right.
          </p>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold mb-2">7-Day Return Window</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Report issues within 7 days of delivery
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-6 h-6 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold mb-2">Free Replacements</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                For damaged or defective products
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold mb-2">Easy Process</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Simple steps to initiate a return
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Return Policy Details */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Eligible for Return */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Eligible for Return/Refund
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-[#0d1f14] rounded-xl border border-green-500/20">
                  <h3 className="font-semibold mb-2 text-green-400">
                    Damaged Products
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Products received in damaged condition due to shipping or
                    handling issues.
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl border border-green-500/20">
                  <h3 className="font-semibold mb-2 text-green-400">
                    Wrong Item Received
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    If you received a different product than what you ordered.
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl border border-green-500/20">
                  <h3 className="font-semibold mb-2 text-green-400">
                    Quality Issues
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Products that don&apos;t meet our quality standards or are
                    spoiled on arrival.
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl border border-green-500/20">
                  <h3 className="font-semibold mb-2 text-green-400">
                    Missing Items
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    If your order is incomplete or items are missing from the
                    package.
                  </p>
                </div>
              </div>
            </div>

            {/* Not Eligible */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-500" />
                Not Eligible for Return
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-[#0d1f14] rounded-xl border border-red-500/20">
                  <h3 className="font-semibold mb-2 text-red-400">
                    Change of Mind
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Due to the nature of food products, we cannot accept returns
                    for change of mind.
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl border border-red-500/20">
                  <h3 className="font-semibold mb-2 text-red-400">
                    Opened Products
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Products that have been opened or used (unless defective).
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl border border-red-500/20">
                  <h3 className="font-semibold mb-2 text-red-400">
                    Late Reports
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Issues reported after 7 days from delivery date.
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl border border-red-500/20">
                  <h3 className="font-semibold mb-2 text-red-400">
                    Sale Items
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Products purchased on clearance or final sale are
                    non-returnable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Return */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">
            How to Return an Item
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#b8860b] flex items-center justify-center flex-shrink-0 text-[#0d1f14] font-bold">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold mb-2">Contact Us</h3>
                  <p className="text-[#f5f0e1]/60">
                    Email us at{" "}
                    <a
                      href="mailto:returns@houseofkumaran.com"
                      className="text-[#b8860b] hover:underline"
                    >
                      returns@houseofkumaran.com
                    </a>{" "}
                    or call us within 7 days of delivery with your order number
                    and reason for return.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#b8860b] flex items-center justify-center flex-shrink-0 text-[#0d1f14] font-bold">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold mb-2">Share Photos</h3>
                  <p className="text-[#f5f0e1]/60">
                    For damaged or quality issues, please share clear photos of
                    the product and packaging. This helps us process your
                    request faster.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#b8860b] flex items-center justify-center flex-shrink-0 text-[#0d1f14] font-bold">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold mb-2">Get Approval</h3>
                  <p className="text-[#f5f0e1]/60">
                    Our team will review your request within 24-48 hours and
                    approve the return/refund if eligible.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#b8860b] flex items-center justify-center flex-shrink-0 text-[#0d1f14] font-bold">
                  4
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold mb-2">
                    Receive Refund/Replacement
                  </h3>
                  <p className="text-[#f5f0e1]/60">
                    Once approved, refunds are processed within 5-7 business
                    days. Replacements are shipped immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Info */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/20">
              <AlertTriangle className="w-6 h-6 text-[#b8860b] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Refund Information</h3>
                <ul className="space-y-2 text-[#f5f0e1]/60 text-sm">
                  <li>
                    • Refunds are credited to the original payment method
                  </li>
                  <li>
                    • Credit/Debit card refunds may take 5-10 business days to
                    reflect
                  </li>
                  <li>• UPI refunds are processed within 2-3 business days</li>
                  <li>
                    • COD orders are refunded via bank transfer or store credit
                  </li>
                  <li>• Shipping charges are non-refundable unless we erred</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#b8860b]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold text-[#0d1f14] mb-4">
            Need to Return Something?
          </h2>
          <p className="text-[#0d1f14]/70 mb-6">
            Our support team is ready to help you with your return.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d1f14] text-[#f5f0e1] font-semibold rounded-full hover:bg-[#1a2f20] transition-colors"
          >
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
