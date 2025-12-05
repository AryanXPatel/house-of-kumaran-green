"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Product, CartItem } from "./types";
import {
  createCart,
  getCart,
  addToCart as shopifyAddToCart,
  updateCartLines,
  removeFromCart as shopifyRemoveFromCart,
  updateCartBuyerIdentity,
  type ShopifyCart,
} from "./shopify";
import { useAuth } from "./auth-context";

const USE_SHOPIFY = process.env.NEXT_PUBLIC_USE_SHOPIFY === "true";

interface ShopifyCartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
  checkoutUrl: string | null;
  goToCheckout: () => void;
  restoreCartFromCloud: (cartId: string) => Promise<void>;
  associateBuyerIdentity: (email: string) => Promise<void>;
}

const ShopifyCartContext = createContext<ShopifyCartContextType | undefined>(
  undefined
);

// Map of product ID to Shopify cart line ID for quick updates
interface CartLineMapping {
  [productId: string]: {
    lineId: string;
    variantId: string;
  };
}

export function ShopifyCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  const { authMethod, syncCartToCloud, googleCustomer } = useAuth();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartLineMapping, setCartLineMapping] = useState<CartLineMapping>({});
  const [hasBuyerIdentitySet, setHasBuyerIdentitySet] = useState(false);

  // Initialize cart
  useEffect(() => {
    const initializeCart = async () => {
      if (!USE_SHOPIFY) {
        // Load from localStorage for non-Shopify mode
        const savedCart = localStorage.getItem("kumaran-cart");
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart));
          } catch (e) {
            console.error("Failed to parse cart:", e);
          }
        }
        setIsHydrated(true);
        return;
      }

      // Shopify mode: load or create cart
      const savedCartId = localStorage.getItem("shopify-cart-id");

      if (savedCartId) {
        try {
          const cart = await getCart(savedCartId);
          if (cart) {
            syncCartFromShopify(cart);
            setShopifyCartId(savedCartId);
            setCheckoutUrl(cart.checkoutUrl);
          } else {
            // Cart expired, create new one
            await createNewShopifyCart();
          }
        } catch (error) {
          console.error("Error loading Shopify cart:", error);
          await createNewShopifyCart();
        }
      } else {
        await createNewShopifyCart();
      }

      setIsHydrated(true);
    };

    initializeCart();
  }, []);

  // Save to localStorage when items change (non-Shopify mode)
  useEffect(() => {
    if (isHydrated && !USE_SHOPIFY) {
      localStorage.setItem("kumaran-cart", JSON.stringify(items));
    }
  }, [items, isHydrated]);

  // Sync cart ID to Supabase when it changes (for Google auth users)
  useEffect(() => {
    if (isHydrated && authMethod === "google" && shopifyCartId) {
      syncCartToCloud(shopifyCartId);
    }
  }, [shopifyCartId, isHydrated, authMethod, syncCartToCloud]);

  // Associate buyer identity when user is already logged in with Google
  // This ensures email is pre-filled at Shopify checkout
  useEffect(() => {
    if (
      isHydrated &&
      USE_SHOPIFY &&
      shopifyCartId &&
      authMethod === "google" &&
      googleCustomer?.email &&
      !hasBuyerIdentitySet
    ) {
      const associateIdentity = async () => {
        try {
          await updateCartBuyerIdentity(
            shopifyCartId,
            googleCustomer.email,
            "IN"
          );
          setHasBuyerIdentitySet(true);
          console.log(
            "Auto-associated buyer identity with cart:",
            googleCustomer.email
          );
        } catch (error) {
          console.error("Error auto-associating buyer identity:", error);
        }
      };
      associateIdentity();
    }
  }, [
    isHydrated,
    shopifyCartId,
    authMethod,
    googleCustomer,
    hasBuyerIdentitySet,
  ]);

  // Create new Shopify cart
  const createNewShopifyCart = async () => {
    try {
      const cart = await createCart();
      setShopifyCartId(cart.id);
      setCheckoutUrl(cart.checkoutUrl);
      localStorage.setItem("shopify-cart-id", cart.id);
    } catch (error) {
      console.error("Error creating Shopify cart:", error);
    }
  };

  // Sync local state from Shopify cart
  const syncCartFromShopify = (cart: ShopifyCart) => {
    const newItems: CartItem[] = [];
    const newMapping: CartLineMapping = {};

    cart.lines.edges.forEach(({ node }) => {
      const { merchandise, quantity } = node;
      const productId =
        merchandise.product.id.split("/").pop() || merchandise.product.id;

      newMapping[productId] = {
        lineId: node.id,
        variantId: merchandise.id,
      };

      newItems.push({
        product: {
          id: productId,
          name: merchandise.product.title,
          slug: merchandise.product.handle,
          description: "",
          price: parseFloat(merchandise.price.amount),
          weight:
            merchandise.title !== "Default Title" ? merchandise.title : "200g",
          category: "podis", // Will be resolved when viewing
          tags: [],
          rating: 4.5,
          reviews: 0,
          image:
            merchandise.image?.url ||
            merchandise.product.images.edges[0]?.node.url ||
            "/placeholder.jpg",
          inStock: true,
          shopifyId: merchandise.product.id,
          variantId: merchandise.id,
        },
        quantity,
      });
    });

    setItems(newItems);
    setCartLineMapping(newMapping);
  };

  const addToCart = useCallback(
    async (product: Product) => {
      if (!USE_SHOPIFY) {
        // Non-Shopify mode: local only
        setItems((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...prev, { product, quantity: 1 }];
        });
        return;
      }

      // Shopify mode
      if (!shopifyCartId || !product.variantId) {
        console.error("Cannot add to cart: missing cart ID or variant ID");
        // Fallback to local for products without Shopify variant
        setItems((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...prev, { product, quantity: 1 }];
        });
        return;
      }

      setIsLoading(true);
      try {
        const cart = await shopifyAddToCart(shopifyCartId, [
          { merchandiseId: product.variantId, quantity: 1 },
        ]);
        syncCartFromShopify(cart);
        setCheckoutUrl(cart.checkoutUrl);
      } catch (error) {
        console.error("Error adding to Shopify cart:", error);
        // Fallback to local
        setItems((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...prev, { product, quantity: 1 }];
        });
      } finally {
        setIsLoading(false);
      }
    },
    [shopifyCartId]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!USE_SHOPIFY) {
        setItems((prev) =>
          prev.filter((item) => item.product.id !== productId)
        );
        return;
      }

      const lineInfo = cartLineMapping[productId];
      if (!shopifyCartId || !lineInfo) {
        setItems((prev) =>
          prev.filter((item) => item.product.id !== productId)
        );
        return;
      }

      setIsLoading(true);
      try {
        const cart = await shopifyRemoveFromCart(shopifyCartId, [
          lineInfo.lineId,
        ]);
        syncCartFromShopify(cart);
        setCheckoutUrl(cart.checkoutUrl);
      } catch (error) {
        console.error("Error removing from Shopify cart:", error);
        setItems((prev) =>
          prev.filter((item) => item.product.id !== productId)
        );
      } finally {
        setIsLoading(false);
      }
    },
    [shopifyCartId, cartLineMapping]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }

      if (!USE_SHOPIFY) {
        setItems((prev) =>
          prev.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
        return;
      }

      const lineInfo = cartLineMapping[productId];
      if (!shopifyCartId || !lineInfo) {
        setItems((prev) =>
          prev.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
        return;
      }

      setIsLoading(true);
      try {
        const cart = await updateCartLines(shopifyCartId, [
          { id: lineInfo.lineId, quantity },
        ]);
        syncCartFromShopify(cart);
        setCheckoutUrl(cart.checkoutUrl);
      } catch (error) {
        console.error("Error updating Shopify cart:", error);
        setItems((prev) =>
          prev.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [shopifyCartId, cartLineMapping, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    if (!USE_SHOPIFY) {
      setItems([]);
      return;
    }

    // For Shopify, we create a new cart instead of clearing
    setItems([]);
    setCartLineMapping({});
    await createNewShopifyCart();
  }, []);

  const goToCheckout = useCallback(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  // Restore cart from cloud (called after Google login)
  const restoreCartFromCloud = useCallback(async (cartId: string) => {
    if (!USE_SHOPIFY || !cartId) return;

    setIsLoading(true);
    try {
      // Try to load the saved cart
      const savedCart = await getCart(cartId);
      if (savedCart && savedCart.lines.edges.length > 0) {
        // Customer has a saved cart with items - use it
        setShopifyCartId(cartId);
        localStorage.setItem("shopify-cart-id", cartId);
        syncCartFromShopify(savedCart);
        setCheckoutUrl(savedCart.checkoutUrl);
        console.log("Restored cart from cloud:", cartId);
      } else {
        console.log("Saved cart empty or expired, keeping current cart");
      }
    } catch (error) {
      console.error("Error restoring cart from cloud:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Associate buyer identity with cart (called after Google login)
  // This pre-fills the email at Shopify checkout
  const associateBuyerIdentity = useCallback(
    async (email: string) => {
      if (!USE_SHOPIFY || !shopifyCartId || !email) return;

      try {
        const updatedCart = await updateCartBuyerIdentity(
          shopifyCartId,
          email,
          "IN"
        );
        setCheckoutUrl(updatedCart.checkoutUrl);
        console.log("Associated buyer identity with cart:", email);
      } catch (error) {
        console.error("Error associating buyer identity:", error);
      }
    },
    [shopifyCartId]
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <ShopifyCartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        checkoutUrl,
        goToCheckout,
        restoreCartFromCloud,
        associateBuyerIdentity,
      }}
    >
      {children}
    </ShopifyCartContext.Provider>
  );
}

export function useShopifyCart() {
  const context = useContext(ShopifyCartContext);
  if (!context) {
    throw new Error("useShopifyCart must be used within a ShopifyCartProvider");
  }
  return context;
}
