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
  type ShopifyCart,
} from "./shopify";

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
  syncCartWithCustomer: (
    customerId: string,
    accessToken: string
  ) => Promise<void>;
  saveCartToCustomer: (customerId: string) => Promise<void>;
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
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartLineMapping, setCartLineMapping] = useState<CartLineMapping>({});

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

  // Sync cart with customer (load their saved cart from cloud)
  const syncCartWithCustomer = useCallback(
    async (customerId: string, accessToken: string) => {
      if (!USE_SHOPIFY || !customerId) return;

      setIsLoading(true);
      try {
        // First, try to get customer's saved cart ID from our backend
        const response = await fetch(
          `/api/customer/cart?customerId=${customerId}`
        );
        const data = await response.json();

        if (data.cartId) {
          // Try to load the saved cart
          try {
            const savedCart = await getCart(data.cartId);
            if (savedCart && savedCart.lines.edges.length > 0) {
              // Customer has a saved cart with items - use it
              setShopifyCartId(data.cartId);
              localStorage.setItem("shopify-cart-id", data.cartId);
              syncCartFromShopify(savedCart);
              setCheckoutUrl(savedCart.checkoutUrl);

              // Also associate cart with customer for checkout
              try {
                const { cartBuyerIdentityUpdate } = await import(
                  "./shopify-customer"
                );
                await cartBuyerIdentityUpdate(data.cartId, accessToken);
              } catch (e) {
                console.error("Error associating cart with customer:", e);
              }

              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Saved cart expired or invalid:", e);
          }
        }

        // If no saved cart or it's empty/invalid, use current cart and associate with customer
        if (shopifyCartId) {
          try {
            const { cartBuyerIdentityUpdate } = await import(
              "./shopify-customer"
            );
            await cartBuyerIdentityUpdate(shopifyCartId, accessToken);

            // Save current cart ID to customer's account for cross-device sync
            await fetch("/api/customer/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ customerId, cartId: shopifyCartId }),
            });
          } catch (e) {
            console.error("Error associating cart with customer:", e);
          }
        }
      } catch (error) {
        console.error("Error syncing cart with customer:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [shopifyCartId]
  );

  // Save current cart to customer's account
  const saveCartToCustomer = useCallback(
    async (customerId: string) => {
      if (!USE_SHOPIFY || !customerId || !shopifyCartId) return;

      try {
        await fetch("/api/customer/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId, cartId: shopifyCartId }),
        });
      } catch (error) {
        console.error("Error saving cart to customer:", error);
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
        syncCartWithCustomer,
        saveCartToCustomer,
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
