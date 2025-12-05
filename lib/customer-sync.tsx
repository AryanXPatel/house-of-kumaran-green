"use client";

import { ReactNode } from "react";

/**
 * CustomerSyncProvider - Now a simple passthrough component
 *
 * Cart and wishlist syncing for Google OAuth users is now handled automatically:
 * - Cart: shopify-cart-context.tsx syncs cart_id to Supabase via /api/user/sync
 * - Wishlist: wishlist-context.tsx syncs product IDs to Supabase via /api/user/sync
 * - Restoration: auth-drawer.tsx calls restoreCartFromCloud/restoreWishlistFromCloud after login
 *
 * This component is kept for backward compatibility but does nothing.
 */
export function CustomerSyncProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
