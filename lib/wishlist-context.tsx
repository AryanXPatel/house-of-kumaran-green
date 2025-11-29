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
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

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

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
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
