"use client";

import { useShopifyCart } from "@/lib/shopify-cart-context";
import { trackCheckoutInitiated } from "@/lib/analytics";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    isLoading,
    checkoutUrl,
    goToCheckout,
  } = useShopifyCart();

  if (!isCartOpen) return null;

  const deliveryFee = totalPrice >= 399 ? 0 : 59;
  const finalTotal = totalPrice + deliveryFee;

  const handleCheckout = () => {
    // Track checkout initiation
    trackCheckoutInitiated(totalPrice, items.length);

    // If Shopify checkout URL is available, use it
    if (checkoutUrl) {
      goToCheckout();
    } else {
      // Fallback to local checkout page
      setIsCartOpen(false);
      window.location.href = "/checkout";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-md bg-[#0d1f14] border-l border-[#b8860b]/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#b8860b]/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#b8860b]" />
            <h2 className="font-serif text-xl font-bold text-[#f5f0e1]">
              Your Cart
            </h2>
            <span className="px-2 py-0.5 bg-[#b8860b]/10 text-[#b8860b] text-sm font-semibold rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#f5f0e1]/70 hover:text-[#f5f0e1] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-[#1a472a]/30 flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-[#b8860b]/50" />
              </div>
              <p className="font-serif text-xl text-[#f5f0e1] mb-2">
                Your cart is empty
              </p>
              <p className="text-[#f5f0e1]/50 mb-8">
                Add some delicious items to get started
              </p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-[#1a472a]/20 rounded-xl border border-[#b8860b]/5"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#f5f0e1] truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-[#f5f0e1]/50">
                      {item.product.weight}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[#b8860b]">
                        ₹{item.product.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-[#0d1f14] rounded-full">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#f5f0e1]/70 hover:text-[#b8860b] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-[#f5f0e1]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#f5f0e1]/70 hover:text-[#b8860b] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-[#f5f0e1]/30 hover:text-red-400 transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#b8860b]/10 space-y-4">
            {/* Delivery Info */}
            {totalPrice < 399 && (
              <div className="p-3 bg-[#b8860b]/10 rounded-lg">
                <p className="text-sm text-[#b8860b]">
                  Add ₹{399 - totalPrice} more for free delivery!
                </p>
                <div className="mt-2 h-1.5 bg-[#0d1f14] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b8860b] rounded-full transition-all duration-500"
                    style={{ width: `${(totalPrice / 399) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#f5f0e1]/70">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-[#f5f0e1]/70">
                <span>Shipping</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-400">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#f5f0e1] pt-2 border-t border-[#b8860b]/10">
                <span>Total</span>
                <span className="text-[#b8860b]">₹{finalTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isLoading}
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

            <Link
              href="/shop"
              onClick={() => setIsCartOpen(false)}
              className="block text-center text-sm text-[#f5f0e1]/50 hover:text-[#b8860b] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
