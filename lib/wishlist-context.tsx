"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import type { Product } from "./types";
import { useAuth } from "./auth-context";
import { trackWishlistAdd, trackWishlistRemove } from "./analytics";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  restoreWishlistFromCloud: (productIds: string[]) => Promise<void>;
  isSyncing: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { authMethod, syncWishlistToCloud } = useAuth();

  // Use ref to avoid sync function being a dependency that triggers useEffect
  const syncFnRef = useRef(syncWishlistToCloud);
  // Track if we've done the initial sync to prevent empty array sync
  const hasLoadedFromStorage = useRef(false);
  // Track if we've already fetched from cloud to prevent duplicate fetches
  const hasFetchedFromCloud = useRef(false);

  // Keep sync function ref updated
  useEffect(() => {
    syncFnRef.current = syncWishlistToCloud;
  }, [syncWishlistToCloud]);

  // Load wishlist from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      try {
        localStorage.removeItem("wishlist");
      } catch { }
    }
    hasLoadedFromStorage.current = true;
    setIsInitialized(true);
  }, []);

  // Fetch wishlist from cloud when user is already logged in with Google
  // This ensures cross-device sync by using cloud as source of truth
  useEffect(() => {
    if (
      !isInitialized ||
      authMethod !== "google" ||
      hasFetchedFromCloud.current
    )
      return;

    const fetchFromCloud = async () => {
      hasFetchedFromCloud.current = true;
      setIsRestoring(true);

      try {
        // Fetch saved wishlist product IDs from Supabase
        const response = await fetch("/api/user/sync?type=wishlist");
        if (!response.ok) {
          console.log("Could not fetch wishlist from cloud");
          return;
        }

        const result = await response.json();
        if (!result.success || !result.data || !Array.isArray(result.data)) {
          console.log("No cloud wishlist found or invalid data");
          return;
        }

        const cloudProductIds = result.data as string[];
        console.log(
          `Fetched ${cloudProductIds.length} wishlist items from cloud`
        );

        if (cloudProductIds.length === 0) {
          // Cloud wishlist is empty - sync local to cloud instead
          if (wishlistItems.length > 0) {
            const productIds = wishlistItems.map((p) => p.id);
            syncFnRef.current(productIds);
          }
          return;
        }

        // Fetch product details for cloud items
        const productPromises = cloudProductIds.map(async (id) => {
          try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) return await res.json();
            return null;
          } catch {
            return null;
          }
        });

        const products = await Promise.all(productPromises);
        const validProducts = products.filter(Boolean) as Product[];

        if (validProducts.length > 0) {
          // Replace local wishlist with cloud wishlist (cloud is source of truth)
          setWishlistItems(validProducts);
          localStorage.setItem("wishlist", JSON.stringify(validProducts));
          console.log(
            `Restored ${validProducts.length} wishlist items from cloud`
          );
        }
      } catch (error) {
        console.error("Error fetching wishlist from cloud:", error);
      } finally {
        setTimeout(() => setIsRestoring(false), 100);
      }
    };

    fetchFromCloud();
  }, [isInitialized, authMethod, wishlistItems]);

  // Save wishlist to localStorage whenever it changes (only after initialization)
  // Also sync to Supabase for Google auth users (but not during restoration)
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    // Guard: Don't sync empty wishlist unless we're sure it's intentional
    // (i.e., user has actually loaded from storage first)
    if (!hasLoadedFromStorage.current) return;

    try {
      // Limit data size to prevent quota issues
      const dataToSave = wishlistItems.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        category: p.category,
        weight: p.weight,
        rating: p.rating,
        reviews: p.reviews,
        inStock: p.inStock,
        isBestseller: p.isBestseller,
        isNew: p.isNew,
      }));
      localStorage.setItem("wishlist", JSON.stringify(dataToSave));

      // Sync product IDs to Supabase for Google auth users
      // Skip sync during restoration to prevent overwriting cloud data
      if (authMethod === "google" && !isRestoring) {
        const productIds = wishlistItems.map((p) => p.id);
        // Use ref to call sync function (avoids dependency that triggers effect)
        syncFnRef.current(productIds);
      }
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
      try {
        localStorage.removeItem("wishlist");
      } catch { }
    }
  }, [wishlistItems, isInitialized, authMethod, isRestoring]);

  const addToWishlist = useCallback((product: Product) => {
    if (!product || !product.id) return;

    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      // Track wishlist add event
      trackWishlistAdd(product.id, product.name);
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    // Track wishlist remove event
    trackWishlistRemove(productId);
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.some((item) => item.id === productId);
    },
    [wishlistItems]
  );

  const toggleWishlist = useCallback((product: Product) => {
    if (!product || !product.id) return;

    setWishlistItems((prev) => {
      const isInList = prev.some((item) => item.id === product.id);
      if (isInList) {
        // Track wishlist remove event
        trackWishlistRemove(product.id);
        return prev.filter((item) => item.id !== product.id);
      }
      // Track wishlist add event
      trackWishlistAdd(product.id, product.name);
      return [...prev, product];
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    try {
      localStorage.removeItem("wishlist");
    } catch { }
  }, []);

  // Restore wishlist from Supabase (called after Google login)
  // Fetches product details for saved product IDs
  const restoreWishlistFromCloud = useCallback(async (productIds: string[]) => {
    if (!productIds || productIds.length === 0) return;

    setIsSyncing(true);
    setIsRestoring(true); // Prevent sync during restoration
    try {
      // Fetch product details for each ID
      const productPromises = productIds.map(async (id) => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (response.ok) {
            return await response.json();
          }
          return null;
        } catch {
          return null;
        }
      });

      const products = await Promise.all(productPromises);
      const validProducts = products.filter(Boolean) as Product[];

      if (validProducts.length > 0) {
        // Merge cloud wishlist with local wishlist
        setWishlistItems((localItems) => {
          const merged = [...localItems];

          // Add cloud items that aren't already in local
          validProducts.forEach((cloudItem) => {
            if (!merged.some((item) => item.id === cloudItem.id)) {
              merged.push(cloudItem);
            }
          });

          // Save merged list to localStorage
          try {
            localStorage.setItem("wishlist", JSON.stringify(merged));
          } catch { }

          return merged;
        });
      }
    } catch (error) {
      console.error("Error restoring wishlist from cloud:", error);
    } finally {
      setIsSyncing(false);
      // Use setTimeout to ensure the state update happens after the wishlist is set
      setTimeout(() => setIsRestoring(false), 100);
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        restoreWishlistFromCloud,
        isSyncing,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
