import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

export const metadata = {
  title: "Shipping Information | House of Kumaran",
  description:
    "Learn about House of Kumaran's shipping policies, delivery times, and shipping charges across India.",
};

const shippingZones = [
  {
    zone: "South India",
    states: "Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana",
    time: "2-4 business days",
    cost: "Free above ₹500, else ₹50",
  },
  {
    zone: "West & Central India",
    states: "Maharashtra, Gujarat, Madhya Pradesh, Rajasthan, Goa",
    time: "4-6 business days",
    cost: "Free above ₹500, else ₹70",
  },
  {
    zone: "North India",
    states: "Delhi NCR, Punjab, Haryana, UP, Uttarakhand",
    time: "5-7 business days",
    cost: "Free above ₹500, else ₹80",
  },
  {
    zone: "East & Northeast India",
    states: "West Bengal, Odisha, Bihar, Assam, and NE states",
    time: "7-10 business days",
    cost: "Free above ₹500, else ₹100",
  },
];

export default function ShippingPage() {
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
            Delivery Info
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Shipping <span className="text-[#b8860b]">Information</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl">
            We deliver the authentic taste of South India to your doorstep
            across all 28 states. Here&apos;s everything you need to know about
            our shipping.
          </p>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold mb-2">Pan-India Delivery</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                We ship to all 28 states and 8 union territories
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-6 h-6 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                On all orders above ₹500
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold mb-2">Secure Packaging</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Food-grade, tamper-proof packaging
              </p>
            </div>

            <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-[#b8860b]" />
              </div>
              <h3 className="font-semibold mb-2">Same-Day Dispatch</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Orders before 2 PM ship the same day
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">
            Shipping Zones & Delivery Times
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {shippingZones.map((zone) => (
              <div
                key={zone.zone}
                className="p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#b8860b]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{zone.zone}</h3>
                    <p className="text-[#f5f0e1]/50 text-sm mb-3">
                      {zone.states}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1 text-[#f5f0e1]/70">
                        <Clock className="w-4 h-4 text-[#b8860b]" />
                        {zone.time}
                      </span>
                      <span className="flex items-center gap-1 text-[#f5f0e1]/70">
                        <IndianRupee className="w-4 h-4 text-[#b8860b]" />
                        {zone.cost}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#b8860b]" />
                What We Offer
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    Real-time order tracking via SMS and email
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    Temperature-controlled packaging for perishables
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    Eco-friendly and recyclable packaging materials
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    Insurance on all orders above ₹1000
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    COD available on orders up to ₹5000
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#b8860b]" />
                Please Note
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    Delivery times may vary during festive seasons
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    Remote areas may have additional delivery time of 2-3 days
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    We do not ship to PO Boxes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mt-2" />
                  <span className="text-[#f5f0e1]/70">
                    International shipping is currently not available
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#b8860b]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold text-[#0d1f14] mb-4">
            Have Questions About Shipping?
          </h2>
          <p className="text-[#0d1f14]/70 mb-6">
            Our support team is here to help you with any shipping-related
            queries.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d1f14] text-[#f5f0e1] font-semibold rounded-full hover:bg-[#1a2f20] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
