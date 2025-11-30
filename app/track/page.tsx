"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  AlertCircle,
} from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<null | {
    found: boolean;
    status?: string;
    steps?: { title: string; date: string; completed: boolean }[];
  }>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);

    // Simulate tracking (in production, this would call an API)
    setTimeout(() => {
      setIsTracking(false);
      // Demo: Show a sample tracking result
      if (orderNumber.startsWith("HOK")) {
        setTrackingResult({
          found: true,
          status: "In Transit",
          steps: [
            { title: "Order Placed", date: "Nov 28, 2025", completed: true },
            { title: "Order Confirmed", date: "Nov 28, 2025", completed: true },
            {
              title: "Packed & Shipped",
              date: "Nov 29, 2025",
              completed: true,
            },
            { title: "In Transit", date: "Nov 30, 2025", completed: true },
            {
              title: "Out for Delivery",
              date: "Expected Dec 1",
              completed: false,
            },
            { title: "Delivered", date: "Expected Dec 1", completed: false },
          ],
        });
      } else {
        setTrackingResult({ found: false });
      }
    }, 1500);
  };

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
            <Package className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[#b8860b] text-sm font-medium">
              Order Tracking
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Track Your <span className="text-[#b8860b]">Order</span>
          </h1>
          <p className="text-xl text-[#f5f0e1]/70 max-w-2xl mx-auto">
            Enter your order details to see the current status of your delivery.
          </p>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <form
            onSubmit={handleTrack}
            className="bg-[#1a472a]/20 rounded-3xl border border-[#b8860b]/10 p-8"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., HOK123456"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
                <p className="text-[#f5f0e1]/40 text-sm mt-2">
                  Find this in your order confirmation email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Email used for the order"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isTracking}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors disabled:opacity-50"
              >
                {isTracking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#0d1f14]/30 border-t-[#0d1f14] rounded-full animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Track Order
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tracking Result */}
          {trackingResult && (
            <div className="mt-8">
              {trackingResult.found ? (
                <div className="bg-[#1a472a]/20 rounded-3xl border border-[#b8860b]/10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#b8860b]/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-[#b8860b]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#f5f0e1]/60">Order Status</p>
                      <p className="font-semibold text-[#b8860b]">
                        {trackingResult.status}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {trackingResult.steps?.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.completed
                                ? "bg-[#b8860b] text-[#0d1f14]"
                                : "border-2 border-[#b8860b]/30 text-[#b8860b]/30"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>
                          {index < (trackingResult.steps?.length || 0) - 1 && (
                            <div
                              className={`w-0.5 h-8 ${
                                step.completed
                                  ? "bg-[#b8860b]"
                                  : "bg-[#b8860b]/20"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p
                            className={`font-medium ${
                              step.completed
                                ? "text-[#f5f0e1]"
                                : "text-[#f5f0e1]/50"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-sm text-[#f5f0e1]/50">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1a472a]/20 rounded-3xl border border-red-500/20 p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    Order Not Found
                  </h3>
                  <p className="text-[#f5f0e1]/60 text-sm mb-4">
                    We couldn&apos;t find an order matching those details.
                    Please check your order number and email.
                  </p>
                  <Link
                    href="/contact"
                    className="text-[#b8860b] hover:underline text-sm"
                  >
                    Contact Support
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6 bg-[#0a1810]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/10 text-center">
              <MapPin className="w-8 h-8 text-[#b8860b] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Tracking</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Track your package in real-time once it&apos;s out for delivery
              </p>
            </div>

            <div className="p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/10 text-center">
              <Clock className="w-8 h-8 text-[#b8860b] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">SMS Updates</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Receive automatic SMS notifications at each delivery milestone
              </p>
            </div>

            <div className="p-6 bg-[#0d1f14] rounded-2xl border border-[#b8860b]/10 text-center">
              <Package className="w-8 h-8 text-[#b8860b] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Delivery Proof</h3>
              <p className="text-[#f5f0e1]/60 text-sm">
                Get a delivery confirmation photo once your order arrives
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
