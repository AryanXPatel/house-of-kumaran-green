"use client";

import { useEffect } from "react";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { checkoutUrl, goToCheckout, items, isLoading } = useShopifyCart();

  useEffect(() => {
    // Auto-redirect to Shopify checkout if available
    if (checkoutUrl && items.length > 0) {
      goToCheckout();
    }
  }, [checkoutUrl, items.length, goToCheckout]);

  // If cart is empty
  if (!isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d1f14] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#1a472a]/30 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-[#b8860b]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#f5f0e1] mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-[#f5f0e1]/70 mb-8">
            Add some products to your cart before checking out.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-bold rounded-full transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Redirecting state
  return (
    <div className="min-h-screen bg-[#0d1f14] flex items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#b8860b] animate-spin mx-auto mb-6" />
        <h1 className="font-serif text-2xl font-bold text-[#f5f0e1] mb-2">
          Redirecting to Secure Checkout
        </h1>
        <p className="text-[#f5f0e1]/70 mb-8">
          Please wait while we prepare your order...
        </p>
        {checkoutUrl && (
          <a
            href={checkoutUrl}
            className="text-[#b8860b] hover:text-[#d4a017] underline text-sm"
          >
            Click here if you&apos;re not redirected automatically
          </a>
        )}
      </div>
    </div>
  );
}
