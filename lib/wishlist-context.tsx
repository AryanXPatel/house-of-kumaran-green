"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { Product } from "./types";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  syncWishlistWithCloud: (customerId: string) => Promise<void>;
  saveWishlistToCloud: (customerId: string) => Promise<void>;
  isSyncing: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
      } catch {}
    }
    setIsInitialized(true);
  }, []);

  // Save wishlist to localStorage whenever it changes (only after initialization)
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

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
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
      try {
        localStorage.removeItem("wishlist");
      } catch {}
    }
  }, [wishlistItems, isInitialized]);

  const addToWishlist = useCallback((product: Product) => {
    if (!product || !product.id) return;

    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
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
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    try {
      localStorage.removeItem("wishlist");
    } catch {}
  }, []);

  // Sync wishlist from cloud (load customer's saved wishlist)
  const syncWishlistWithCloud = useCallback(async (customerId: string) => {
    if (!customerId) return;

    setIsSyncing(true);
    try {
      const response = await fetch(
        `/api/customer/wishlist?customerId=${customerId}`
      );
      const data = await response.json();

      if (
        data.wishlist &&
        Array.isArray(data.wishlist) &&
        data.wishlist.length > 0
      ) {
        // Merge cloud wishlist with local wishlist
        setWishlistItems((localItems) => {
          const cloudItems = data.wishlist as Product[];
          const merged = [...localItems];

          // Add cloud items that aren't already in local
          cloudItems.forEach((cloudItem) => {
            if (!merged.some((item) => item.id === cloudItem.id)) {
              merged.push(cloudItem);
            }
          });

          // Save merged list to localStorage
          try {
            localStorage.setItem("wishlist", JSON.stringify(merged));
          } catch {}

          return merged;
        });
      }
    } catch (error) {
      console.error("Error syncing wishlist from cloud:", error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Save wishlist to cloud
  const saveWishlistToCloud = useCallback(
    async (customerId: string) => {
      if (!customerId || wishlistItems.length === 0) return;

      try {
        await fetch("/api/customer/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            wishlist: wishlistItems.map((item) => ({
              id: item.id,
              name: item.name,
              slug: item.slug,
              price: item.price,
              image: item.image,
            })),
          }),
        });
      } catch (error) {
        console.error("Error saving wishlist to cloud:", error);
      }
    },
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        syncWishlistWithCloud,
        saveWishlistToCloud,
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
