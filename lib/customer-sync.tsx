"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "./auth-context";
import { useShopifyCart } from "./shopify-cart-context";
import { useWishlist } from "./wishlist-context";

/**
 * Hook to automatically sync cart and wishlist when user logs in/out
 * Place this in your layout or app wrapper
 */
export function useCustomerSync() {
  const { customer, isAuthenticated, accessToken, getCustomerId } = useAuth();
  const { syncCartWithCustomer, saveCartToCustomer } = useShopifyCart();
  const { syncWishlistWithCloud, saveWishlistToCloud } = useWishlist();

  // Track if we've already synced for this session
  const hasSynced = useRef(false);
  const previousCustomerId = useRef<string | null>(null);

  useEffect(() => {
    const customerId = getCustomerId();

    // Check if customer changed (login/logout)
    if (customerId !== previousCustomerId.current) {
      hasSynced.current = false;
      previousCustomerId.current = customerId;
    }

    // Sync on login
    if (isAuthenticated && customerId && accessToken && !hasSynced.current) {
      hasSynced.current = true;

      // Sync cart with customer account
      syncCartWithCustomer(customerId, accessToken);

      // Sync wishlist from cloud
      syncWishlistWithCloud(customerId);
    }
  }, [
    isAuthenticated,
    customer,
    accessToken,
    getCustomerId,
    syncCartWithCustomer,
    syncWishlistWithCloud,
  ]);

  // Save cart and wishlist to cloud periodically when user is logged in
  useEffect(() => {
    if (!isAuthenticated) return;

    const customerId = getCustomerId();
    if (!customerId) return;

    // Save to cloud every 30 seconds if user is active
    const saveInterval = setInterval(() => {
      saveCartToCustomer(customerId);
      saveWishlistToCloud(customerId);
    }, 30000);

    // Also save when page is about to unload
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable saving on page close
      const cartData = localStorage.getItem("shopify-cart-id");
      if (cartData) {
        navigator.sendBeacon(
          "/api/customer/cart",
          JSON.stringify({ customerId, cartId: cartData })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAuthenticated, getCustomerId, saveCartToCustomer, saveWishlistToCloud]);

  return { isAuthenticated, customer };
}

/**
 * Component wrapper version for easy use in layouts
 */
export function CustomerSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useCustomerSync();
  return <>{children}</>;
}
