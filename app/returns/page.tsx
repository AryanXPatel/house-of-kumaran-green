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
  Shield,
  Camera,
  CreditCard,
  Truck,
  BadgePercent,
} from "lucide-react";

export const metadata = {
  title: "Returns & Refunds | House of Kumaran",
  description:
    "Learn about House of Kumaran's return policy, refund process, and our 60% refund guarantee for damaged or expired products.",
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-96 h-96 border border-[#b8860b] rounded-full" />
          <div className="absolute bottom-10 left-10 w-64 h-64 border border-[#b8860b] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          <p className="text-[#b8860b] text-sm tracking-[0.3em] uppercase mb-4">
            Customer First Policy
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Returns & <span className="text-[#b8860b]">Refunds</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl">
            Your satisfaction is our priority. We stand behind every product we
            sell with our hassle-free return policy and 70% refund guarantee.
          </p>
        </div>
      </section>

      {/* 70% Refund Guarantee Banner */}
      <section className="py-8 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#b8860b]/20 via-[#d4a017]/10 to-[#b8860b]/20 border-2 border-[#b8860b]/40 p-8 md:p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8860b]/5 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#b8860b] flex items-center justify-center flex-shrink-0">
                <Shield className="w-10 h-10 text-[#0d1f14]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                  70% Refund Guarantee —{" "}
                  <span className="text-[#b8860b]">No Questions Asked</span>
                </h2>
                <p className="text-[#f5f0e1]/70 text-lg max-w-2xl">
                  Received a damaged, spilled, missing, or expired product?
                  We&apos;ll refund 70% of your purchase instantly with a simple
                  unpacking video. No hassle, no arguments, no complicated
                  process.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="text-center px-6 py-4 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/30">
                  <BadgePercent className="w-8 h-8 text-[#b8860b] mx-auto mb-2" />
                  <p className="text-3xl font-bold text-[#b8860b]">70%</p>
                  <p className="text-sm text-[#f5f0e1]/60">Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center hover:border-[#b8860b]/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">3-Day Window</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Report issues within 3 days of delivery for full assistance
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center hover:border-[#b8860b]/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-7 h-7 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Replacements</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Defective products replaced at no extra cost
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center hover:border-[#b8860b]/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quick Refunds</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Refunds processed within 3-5 business days
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center hover:border-[#b8860b]/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Process</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Simple 3-step return process via WhatsApp or email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 70% Refund Details */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              How Our 70% Guarantee Works
            </h2>
            <p className="text-[#f5f0e1]/60 max-w-2xl mx-auto">
              We believe in transparency. If your product arrives damaged,
              spilled, missing, or expired, here&apos;s exactly what happens:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#b8860b] flex items-center justify-center mx-auto mb-4 text-[#0d1f14] font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Report the Issue</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Contact us within 3 days of delivery via WhatsApp or email with
                your order number
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#b8860b] flex items-center justify-center mx-auto mb-4 text-[#0d1f14] font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Share Unpacking Video
              </h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Send a video of you opening the parcel showing the damage,
                spillage, missing items, or expiry date. Photos alone are not
                sufficient.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#b8860b] flex items-center justify-center mx-auto mb-4 text-[#0d1f14] font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Get 70% Refund</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Receive 70% refund to your original payment method within 3-5
                business days
              </p>
            </div>
          </div>

          <div className="mt-10 p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/20 max-w-3xl mx-auto">
            <h4 className="font-semibold text-[#b8860b] mb-3">
              What&apos;s Covered Under 70% Guarantee (Unpacking Video
              Required):
            </h4>
            <ul className="grid sm:grid-cols-2 gap-3 text-[#f5f0e1]/70 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Products damaged during transit
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Containers with spilled contents
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Products received past expiry date
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Broken seals or tampered packaging
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Visible mold or contamination
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Manufacturing defects
              </li>
            </ul>
            <div className="mt-4 p-4 bg-[#b8860b]/10 border border-[#b8860b]/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-[#b8860b] mb-1">
                    📹 Mandatory Unpacking Video Required
                  </h5>
                  <p className="text-[#f5f0e1]/70 text-sm">
                    To claim the 70% refund, you must provide a video recording
                    of you opening the parcel. The video should clearly show the
                    outer packaging, unboxing process, and the
                    damaged/spilled/missing/expired product. Photos alone will
                    not be accepted for refund claims.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Refund/Replacement Policy */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">
            Full Refund & Replacement Policy
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Eligible for Full Refund/Replacement */}
            <div className="bg-[#1a472a]/20 rounded-2xl border border-green-500/20 p-6">
              <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2 text-green-400">
                <CheckCircle className="w-6 h-6" />
                Eligible for 100% Refund/Replacement
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#0d1f14] rounded-xl">
                  <h4 className="font-semibold mb-1">Wrong Item Received</h4>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    You received a different product than what you ordered
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl">
                  <h4 className="font-semibold mb-1">Missing Items</h4>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Items missing from your order or package
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl">
                  <h4 className="font-semibold mb-1">
                    Quality Not as Described
                  </h4>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Product doesn&apos;t match the description on our website
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl">
                  <h4 className="font-semibold mb-1">Order Never Arrived</h4>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Package marked delivered but not received (with proof)
                  </p>
                </div>
              </div>
            </div>

            {/* Not Eligible */}
            <div className="bg-[#1a472a]/20 rounded-2xl border border-red-500/20 p-6">
              <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2 text-red-400">
                <XCircle className="w-6 h-6" />
                Not Eligible for Return
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#0d1f14] rounded-xl">
                  <h4 className="font-semibold mb-1">Change of Mind</h4>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Food products cannot be returned due to personal preference
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl">
                  <h4 className="font-semibold mb-1">
                    Opened & Consumed Products
                  </h4>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Products that have been opened and partially used
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl">
                  <h4 className="font-semibold mb-1">Reports After 3 Days</h4>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Issues must be reported within 3 days of delivery
                  </p>
                </div>
                <div className="p-4 bg-[#0d1f14] rounded-xl">
                  <h4 className="font-semibold mb-1">Clearance/Sale Items</h4>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Final sale items marked as non-returnable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Return */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-4 text-center">
            How to Initiate a Return
          </h2>
          <p className="text-[#f5f0e1]/60 text-center mb-12 max-w-xl mx-auto">
            We&apos;ve made the process as simple as possible. Most returns are
            processed within 24 hours.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Option 1: WhatsApp */}
              <div className="p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/20">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl mb-2">Via WhatsApp</h3>
                <p className="text-[#f5f0e1]/60 text-sm mb-4">
                  Fastest response • Usually within 2 hours
                </p>
                <a
                  href="https://wa.me/917358407027?text=Hi,%20I%20need%20help%20with%20a%20return"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
                >
                  Message Us
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Option 2: Email */}
              <div className="p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/20">
                <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-[#b8860b]" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Via Email</h3>
                <p className="text-[#f5f0e1]/60 text-sm mb-4">
                  Detailed support • Response within 24 hours
                </p>
                <a
                  href="mailto:support@houseofkumaran.com?subject=Return%20Request"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
                >
                  Send Email
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* What to Include */}
            <div className="mt-8 p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/20">
              <h4 className="font-semibold text-[#b8860b] mb-4">
                Please Include in Your Request:
              </h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
                  <span className="text-[#f5f0e1]/70 text-sm">
                    Order number
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
                  <span className="text-[#f5f0e1]/70 text-sm">
                    Product name(s)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
                  <span className="text-[#f5f0e1]/70 text-sm font-semibold">
                    📹 Unpacking video (REQUIRED)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
                  <span className="text-[#f5f0e1]/70 text-sm">
                    Brief description
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">
            Refund Processing Times
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-5 bg-[#1a472a]/20 rounded-xl border border-[#b8860b]/10 text-center">
              <CreditCard className="w-8 h-8 text-[#b8860b] mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Credit/Debit Card</h4>
              <p className="text-[#f5f0e1]/60 text-sm">5-10 business days</p>
            </div>
            <div className="p-5 bg-[#1a472a]/20 rounded-xl border border-[#b8860b]/10 text-center">
              <div className="w-8 h-8 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-[#b8860b] font-bold text-xs">UPI</span>
              </div>
              <h4 className="font-semibold mb-1">UPI Payments</h4>
              <p className="text-[#f5f0e1]/60 text-sm">2-3 business days</p>
            </div>
            <div className="p-5 bg-[#1a472a]/20 rounded-xl border border-[#b8860b]/10 text-center">
              <Truck className="w-8 h-8 text-[#b8860b] mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Cash on Delivery</h4>
              <p className="text-[#f5f0e1]/60 text-sm">
                Bank transfer / Store credit
              </p>
            </div>
            <div className="p-5 bg-[#1a472a]/20 rounded-xl border border-[#b8860b]/10 text-center">
              <Package className="w-8 h-8 text-[#b8860b] mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Replacements</h4>
              <p className="text-[#f5f0e1]/60 text-sm">
                Shipped within 24-48 hrs
              </p>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/20">
              <AlertTriangle className="w-6 h-6 text-[#b8860b] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Important Notes</h4>
                <ul className="space-y-1.5 text-[#f5f0e1]/60 text-sm">
                  <li>• Refunds are credited to the original payment method</li>
                  <li>
                    • Shipping charges are non-refundable unless we made an
                    error
                  </li>
                  <li>
                    • For COD orders, please provide your bank details for
                    refund
                  </li>
                  <li>
                    • Store credit never expires and can be used on any future
                    order
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#b8860b]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0d1f14] mb-4">
            Need Help with a Return?
          </h2>
          <p className="text-[#0d1f14]/70 mb-6 max-w-lg mx-auto">
            Our customer support team is here to help. We aim to resolve all
            issues within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d1f14] text-[#f5f0e1] font-semibold rounded-full hover:bg-[#1a2f20] transition-colors"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/917358407027"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d1f14]/10 text-[#0d1f14] font-semibold rounded-full hover:bg-[#0d1f14]/20 transition-colors border border-[#0d1f14]/30"
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
