"use client";

import type React from "react";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Truck,
  Shield,
  Lock,
  CreditCard,
  Wallet,
  Building2,
  Check,
} from "lucide-react";

type Step = "shipping" | "payment" | "confirmation";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "upi" | "netbanking" | "cod"
  >("upi");

  const deliveryFee = totalPrice >= 500 ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderPlaced(true);
    setCurrentStep("confirmation");
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
        <Navbar />
        <section className="pt-28 pb-20 px-6 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="font-serif text-2xl mb-4">Your cart is empty</p>
          <Link href="/shop" className="text-[#b8860b] hover:underline">
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
        <Navbar />
        <section className="pt-28 pb-20 px-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-8">
            <Check className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Order Confirmed!
          </h1>
          <p className="text-[#f5f0e1]/70 text-lg mb-2">
            Thank you for your order, {shippingData.firstName}!
          </p>
          <p className="text-[#f5f0e1]/50 mb-8 max-w-md">
            We&apos;ve received your order and will begin preparing it shortly.
            You&apos;ll receive a confirmation email at {shippingData.email}
          </p>
          <div className="p-6 bg-[#1a472a]/30 rounded-xl mb-8">
            <p className="text-sm text-[#f5f0e1]/50 mb-1">Order Number</p>
            <p className="text-2xl font-mono text-[#b8860b] font-bold">
              HOK{Date.now().toString().slice(-8)}
            </p>
          </div>
          <Link
            href="/shop"
            className="px-8 py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Back Link */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Cart
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {["shipping", "payment"].map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    currentStep === step
                      ? "bg-[#b8860b] text-[#0d1f14]"
                      : index < ["shipping", "payment"].indexOf(currentStep)
                      ? "bg-green-500 text-white"
                      : "bg-[#1a472a]/30 text-[#f5f0e1]/50"
                  }`}
                >
                  {index < ["shipping", "payment"].indexOf(currentStep) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`capitalize ${
                    currentStep === step
                      ? "text-[#f5f0e1]"
                      : "text-[#f5f0e1]/50"
                  }`}
                >
                  {step}
                </span>
                {index < 1 && <div className="w-20 h-px bg-[#b8860b]/20" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {currentStep === "shipping" && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#f5f0e1]/70 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.firstName}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/10 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#f5f0e1]/70 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.lastName}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/10 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#f5f0e1]/70 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingData.email}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/10 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#f5f0e1]/70 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/10 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#f5f0e1]/70 mb-2">
                      Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={shippingData.address}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/10 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors resize-none"
                      placeholder="House/Flat No., Street, Area"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-[#f5f0e1]/70 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.city}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/10 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#f5f0e1]/70 mb-2">
                        State
                      </label>
                      <select
                        required
                        value={shippingData.state}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/10 rounded-xl text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none transition-colors"
                      >
                        <option value="">Select State</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#f5f0e1]/70 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        value={shippingData.pincode}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            pincode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#b8860b]/10 rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="6-digit PIN"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-bold rounded-full transition-colors mt-8"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {currentStep === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    {[
                      {
                        id: "upi",
                        label: "UPI",
                        icon: Wallet,
                        desc: "Pay using any UPI app",
                      },
                      {
                        id: "card",
                        label: "Credit/Debit Card",
                        icon: CreditCard,
                        desc: "Visa, Mastercard, RuPay",
                      },
                      {
                        id: "netbanking",
                        label: "Net Banking",
                        icon: Building2,
                        desc: "All major banks supported",
                      },
                      {
                        id: "cod",
                        label: "Cash on Delivery",
                        icon: Truck,
                        desc: "Pay when you receive",
                      },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? "border-[#b8860b] bg-[#b8860b]/10"
                            : "border-[#b8860b]/10 bg-[#1a472a]/20 hover:border-[#b8860b]/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value as typeof paymentMethod
                            )
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            paymentMethod === method.id
                              ? "bg-[#b8860b] text-[#0d1f14]"
                              : "bg-[#1a472a]/50 text-[#f5f0e1]/50"
                          }`}
                        >
                          <method.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{method.label}</p>
                          <p className="text-sm text-[#f5f0e1]/50">
                            {method.desc}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 ${
                            paymentMethod === method.id
                              ? "border-[#b8860b] bg-[#b8860b]"
                              : "border-[#f5f0e1]/30"
                          }`}
                        >
                          {paymentMethod === method.id && (
                            <Check className="w-full h-full text-[#0d1f14] p-0.5" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("shipping")}
                      className="px-8 py-4 border border-[#b8860b]/20 text-[#f5f0e1] font-semibold rounded-full hover:border-[#b8860b] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 py-4 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#0d1f14]/30 border-t-[#0d1f14] rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay ₹{finalTotal}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 p-6">
                <h2 className="font-serif text-xl font-bold mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#b8860b] rounded-full flex items-center justify-center text-[10px] font-bold text-[#0d1f14]">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[#f5f0e1]/50">
                          {item.product.weight}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-3 text-sm border-t border-[#b8860b]/10 pt-4">
                  <div className="flex justify-between text-[#f5f0e1]/70">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-[#f5f0e1]/70">
                    <span>Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-[#f5f0e1] pt-4 border-t border-[#b8860b]/10">
                    <span>Total</span>
                    <span className="text-[#b8860b]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-6 pt-6 border-t border-[#b8860b]/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#f5f0e1]/50">
                    <Shield className="w-4 h-4 text-[#b8860b]" />
                    <span>Your data is protected with 256-bit encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
