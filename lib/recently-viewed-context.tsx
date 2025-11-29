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

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<
  RecentlyViewedContextType | undefined
>(undefined);

const MAX_RECENTLY_VIEWED = 8;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const isUpdatingRef = useRef(false);

  // Load recently viewed from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedRecent = localStorage.getItem("recentlyViewed");
      if (savedRecent) {
        const parsed = JSON.parse(savedRecent);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed.slice(0, MAX_RECENTLY_VIEWED));
        }
      }
    } catch (error) {
      console.error("Error loading recentlyViewed from localStorage:", error);
      // Clear corrupted data
      try {
        localStorage.removeItem("recentlyViewed");
      } catch {}
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever it changes (only after initialization)
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;
    if (isUpdatingRef.current) return;

    try {
      // Limit data size to prevent quota issues
      const dataToSave = recentlyViewed
        .slice(0, MAX_RECENTLY_VIEWED)
        .map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          image: p.image,
          category: p.category,
          weight: p.weight,
          rating: p.rating,
          reviews: p.reviews,
          inStock: p.inStock,
        }));
      localStorage.setItem("recentlyViewed", JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving recentlyViewed to localStorage:", error);
      // If quota exceeded, clear old data
      try {
        localStorage.removeItem("recentlyViewed");
      } catch {}
    }
  }, [recentlyViewed, isInitialized]);

  const addToRecentlyViewed = useCallback((product: Product) => {
    if (!product || !product.id) return;

    isUpdatingRef.current = true;
    setRecentlyViewed((prev) => {
      // Check if already at front
      if (prev[0]?.id === product.id) {
        isUpdatingRef.current = false;
        return prev;
      }
      // Remove if already exists (to move to front)
      const filtered = prev.filter((item) => item.id !== product.id);
      // Add to front and limit to max items
      const result = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      isUpdatingRef.current = false;
      return result;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem("recentlyViewed");
    } catch {}
  }, []);

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error(
      "useRecentlyViewed must be used within a RecentlyViewedProvider"
    );
  }
  return context;
}
