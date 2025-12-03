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
  ExternalLink,
  Loader2,
} from "lucide-react";

// NimbusPost tracking URL
const NIMBUSPOST_TRACKING_URL = "https://ship.nimbuspost.com/shipping/tracking";

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingType, setTrackingType] = useState<"order" | "awb">("order");
  const [email, setEmail] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<null | {
    found: boolean;
    status?: string;
    awbNumber?: string;
    courier?: string;
    steps?: { title: string; date: string; completed: boolean }[];
    error?: string;
  }>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setTrackingResult(null);

    try {
      if (trackingType === "awb") {
        // For AWB tracking, redirect to NimbusPost tracking page
        window.open(`${NIMBUSPOST_TRACKING_URL}/${trackingNumber}`, "_blank");
        setIsTracking(false);
        return;
      }

      // For order number tracking, try to fetch from Shopify
      // Note: This requires server-side API route for security
      const response = await fetch(`/api/track-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: trackingNumber, email }),
      });

      if (response.ok) {
        const data = await response.json();
        setTrackingResult({
          found: true,
          status: data.fulfillmentStatus || "Processing",
          awbNumber: data.trackingNumber,
          courier: data.trackingCompany,
          steps: data.steps || generateSteps(data.fulfillmentStatus),
        });
      } else {
        // Fallback: Show helpful message
        setTrackingResult({
          found: false,
          error: "Order not found. Try using your AWB/tracking number instead.",
        });
      }
    } catch {
      // If API doesn't exist yet, show demo/helpful info
      setTrackingResult({
        found: false,
        error:
          "Tracking service is being set up. Please use your AWB number to track directly with NimbusPost.",
      });
    } finally {
      setIsTracking(false);
    }
  };

  // Generate tracking steps based on fulfillment status
  const generateSteps = (status: string) => {
    const allSteps = [
      { title: "Order Placed", date: "", completed: true },
      { title: "Order Confirmed", date: "", completed: true },
      { title: "Packed & Shipped", date: "", completed: false },
      { title: "In Transit", date: "", completed: false },
      { title: "Out for Delivery", date: "", completed: false },
      { title: "Delivered", date: "", completed: false },
    ];

    const statusMap: Record<string, number> = {
      UNFULFILLED: 1,
      PARTIALLY_FULFILLED: 2,
      FULFILLED: 3,
      IN_TRANSIT: 3,
      OUT_FOR_DELIVERY: 4,
      DELIVERED: 5,
    };

    const completedCount = statusMap[status] || 1;
    return allSteps.map((step, index) => ({
      ...step,
      completed: index < completedCount,
    }));
  };

  const handleDirectTrack = () => {
    if (trackingNumber) {
      window.open(`${NIMBUSPOST_TRACKING_URL}/${trackingNumber}`, "_blank");
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
              {/* Tracking Type Toggle */}
              <div className="flex rounded-full bg-[#0d1f14] border border-[#b8860b]/20 p-1">
                <button
                  type="button"
                  onClick={() => setTrackingType("order")}
                  className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all ${
                    trackingType === "order"
                      ? "bg-[#b8860b] text-[#0d1f14]"
                      : "text-[#f5f0e1]/60 hover:text-[#f5f0e1]"
                  }`}
                >
                  Order Number
                </button>
                <button
                  type="button"
                  onClick={() => setTrackingType("awb")}
                  className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all ${
                    trackingType === "awb"
                      ? "bg-[#b8860b] text-[#0d1f14]"
                      : "text-[#f5f0e1]/60 hover:text-[#f5f0e1]"
                  }`}
                >
                  AWB / Tracking #
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {trackingType === "order"
                    ? "Order Number"
                    : "AWB / Tracking Number"}
                </label>
                <input
                  type="text"
                  placeholder={
                    trackingType === "order"
                      ? "e.g., #1001 or HOK123456"
                      : "e.g., NB123456789"
                  }
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0d1f14] border border-[#b8860b]/20 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:outline-none focus:border-[#b8860b] transition-colors"
                />
                <p className="text-[#f5f0e1]/40 text-sm mt-2">
                  {trackingType === "order"
                    ? "Find this in your order confirmation email"
                    : "AWB number from your shipping notification"}
                </p>
              </div>

              {trackingType === "order" && (
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
              )}

              <button
                type="submit"
                disabled={isTracking}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors disabled:opacity-50"
              >
                {isTracking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    {trackingType === "awb" ? (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Track on NimbusPost
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Track Order
                      </>
                    )}
                  </>
                )}
              </button>

              {/* Direct NimbusPost link */}
              <p className="text-center text-[#f5f0e1]/40 text-sm">
                Have your AWB number?{" "}
                <button
                  type="button"
                  onClick={handleDirectTrack}
                  className="text-[#b8860b] hover:underline"
                >
                  Track directly on NimbusPost →
                </button>
              </p>
            </div>
          </form>

          {/* Tracking Result */}
          {trackingResult && (
            <div className="mt-8">
              {trackingResult.found ? (
                <div className="bg-[#1a472a]/20 rounded-3xl border border-[#b8860b]/10 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#b8860b]/10 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-[#b8860b]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#f5f0e1]/60">
                          Order Status
                        </p>
                        <p className="font-semibold text-[#b8860b]">
                          {trackingResult.status}
                        </p>
                      </div>
                    </div>
                    {trackingResult.awbNumber && (
                      <a
                        href={`${NIMBUSPOST_TRACKING_URL}/${trackingResult.awbNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-[#b8860b] hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Track Live
                      </a>
                    )}
                  </div>

                  {/* AWB Info */}
                  {trackingResult.awbNumber && (
                    <div className="mb-6 p-4 bg-[#0d1f14] rounded-xl border border-[#b8860b]/10">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-[#f5f0e1]/40 mb-1">
                            AWB / Tracking Number
                          </p>
                          <p className="font-mono font-semibold">
                            {trackingResult.awbNumber}
                          </p>
                        </div>
                        {trackingResult.courier && (
                          <div className="text-right">
                            <p className="text-xs text-[#f5f0e1]/40 mb-1">
                              Courier
                            </p>
                            <p className="font-semibold text-[#b8860b]">
                              {trackingResult.courier}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                    {trackingResult.error ||
                      "We couldn't find an order matching those details. Please check your order number and email."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setTrackingType("awb")}
                      className="px-4 py-2 bg-[#b8860b] text-[#0d1f14] rounded-full text-sm font-semibold hover:bg-[#d4a017] transition-colors"
                    >
                      Try AWB Tracking
                    </button>
                    <Link
                      href="/contact"
                      className="px-4 py-2 border border-[#b8860b]/30 text-[#b8860b] rounded-full text-sm font-semibold hover:bg-[#b8860b]/10 transition-colors"
                    >
                      Contact Support
                    </Link>
                  </div>
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
