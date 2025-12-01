"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  Loader2,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    isLoading,
    checkoutUrl,
    goToCheckout,
  } = useShopifyCart();

  const deliveryFee = totalPrice >= 500 ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12">
            Shopping Cart
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-[#1a472a]/30 flex items-center justify-center mb-8">
                <ShoppingBag className="w-12 h-12 text-[#b8860b]/50" />
              </div>
              <p className="font-serif text-2xl text-[#f5f0e1] mb-4">
                Your cart is empty
              </p>
              <p className="text-[#f5f0e1]/50 mb-8 max-w-md">
                Looks like you haven&apos;t added anything yet. Explore our
                authentic South Indian delicacies.
              </p>
              <Link
                href="/shop"
                className="flex items-center gap-2 px-8 py-4 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#b8860b]/10">
                  <p className="text-[#f5f0e1]/50">{totalItems} items</p>
                  <Link
                    href="/shop"
                    className="text-sm text-[#b8860b] hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-6 p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/5"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="hover:text-[#b8860b] transition-colors"
                        >
                          <h3 className="font-serif text-lg font-bold">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-[#f5f0e1]/50">
                          {item.product.weight}
                        </p>
                        <p className="text-[#b8860b] font-semibold mt-1">
                          ₹{item.product.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Quantity */}
                        <div className="flex items-center border border-[#b8860b]/20 rounded-full">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-10 h-10 flex items-center justify-center text-[#f5f0e1]/70 hover:text-[#b8860b] transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-10 h-10 flex items-center justify-center text-[#f5f0e1]/70 hover:text-[#b8860b] transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Total */}
                        <p className="font-bold text-lg min-w-[80px] text-right">
                          ₹{item.product.price * item.quantity}
                        </p>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-[#f5f0e1]/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/10 p-6">
                  <h2 className="font-serif text-xl font-bold mb-6">
                    Order Summary
                  </h2>

                  {/* Delivery Progress */}
                  {totalPrice < 500 && (
                    <div className="p-4 bg-[#b8860b]/10 rounded-xl mb-6">
                      <p className="text-sm text-[#b8860b] font-medium">
                        Add ₹{500 - totalPrice} more for FREE delivery!
                      </p>
                      <div className="mt-3 h-2 bg-[#0d1f14] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#b8860b] rounded-full transition-all duration-500"
                          style={{ width: `${(totalPrice / 500) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="space-y-3 text-sm mb-6">
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

                  {/* Checkout Button */}
                  <button
                    onClick={() => goToCheckout()}
                    disabled={isLoading || !checkoutUrl}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#b8860b] hover:bg-[#d4a017] disabled:opacity-50 text-[#0d1f14] font-bold rounded-full transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-[#b8860b]/10 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-[#f5f0e1]/70">
                      <Truck className="w-5 h-5 text-[#b8860b]" />
                      <span>Free delivery on orders above ₹500</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#f5f0e1]/70">
                      <Shield className="w-5 h-5 text-[#b8860b]" />
                      <span>Secure payment guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
