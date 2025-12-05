"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  customerAccessTokenCreate,
  customerAccessTokenDelete,
  customerCreate,
  customerRecover,
  getCustomer,
  ShopifyCustomer,
  CustomerAccessToken,
} from "./shopify-customer";

// Google OAuth customer data (from Supabase + Google)
export interface GoogleAuthCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  name: string;
  picture?: string;
  verifiedEmail: boolean;
  authMethod: "google";
}

// Data returned on Google login for cart/wishlist restoration
export interface GoogleLoginData {
  savedCartId: string | null;
  savedWishlistProductIds: string[];
  email: string;
}

interface AuthContextType {
  customer: ShopifyCustomer | null;
  googleCustomer: GoogleAuthCustomer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  authMethod: "email" | "google" | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (
    credential: string
  ) => Promise<{ success: boolean; error?: string; data?: GoogleLoginData }>;
  syncCartToCloud: (cartId: string | null) => Promise<void>;
  syncWishlistToCloud: (productIds: string[]) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  recoverPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshCustomer: () => Promise<void>;
  getCustomerId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = "shopify_customer_token";
const TOKEN_EXPIRY_KEY = "shopify_customer_token_expiry";
const GOOGLE_CUSTOMER_KEY = "hok_google_customer";
const AUTH_METHOD_KEY = "hok_auth_method";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [googleCustomer, setGoogleCustomer] =
    useState<GoogleAuthCustomer | null>(null);
  const [authMethod, setAuthMethod] = useState<"email" | "google" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Load token from storage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadStoredAuth = async () => {
      try {
        // Check for Google auth first (stored in localStorage)
        const storedGoogleCustomer = localStorage.getItem(GOOGLE_CUSTOMER_KEY);
        const storedAuthMethod = localStorage.getItem(AUTH_METHOD_KEY);

        if (storedGoogleCustomer && storedAuthMethod === "google") {
          const parsedGoogleCustomer = JSON.parse(
            storedGoogleCustomer
          ) as GoogleAuthCustomer;
          setGoogleCustomer(parsedGoogleCustomer);
          setAuthMethod("google");

          // Also load the Storefront API token for Google auth users
          const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
          const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
          if (storedToken && storedExpiry) {
            const expiryDate = new Date(storedExpiry);
            if (expiryDate > new Date()) {
              setAccessToken(storedToken);
              // Optionally fetch full customer data
              const customerData = await getCustomer(storedToken);
              if (customerData) {
                setCustomer(customerData);
              }
            }
          }

          setIsLoading(false);
          return;
        }

        // Check for email/password auth
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

        if (storedToken && storedExpiry) {
          const expiryDate = new Date(storedExpiry);

          // Check if token is expired
          if (expiryDate > new Date()) {
            setAccessToken(storedToken);

            // Fetch customer data
            const customerData = await getCustomer(storedToken);
            if (customerData) {
              setCustomer(customerData);
            } else {
              // Token invalid, clear storage
              clearStoredAuth();
            }
          } else {
            // Token expired, clear storage
            clearStoredAuth();
          }
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
        clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const clearStoredAuth = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(GOOGLE_CUSTOMER_KEY);
    localStorage.removeItem(AUTH_METHOD_KEY);
    setAccessToken(null);
    setCustomer(null);
    setGoogleCustomer(null);
    setAuthMethod(null);
  };

  const storeAuth = (token: CustomerAccessToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.accessToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, token.expiresAt);
    localStorage.setItem(AUTH_METHOD_KEY, "email");
    setAccessToken(token.accessToken);
    setAuthMethod("email");
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await customerAccessTokenCreate(email, password);

      if (result.customerUserErrors.length > 0) {
        return {
          success: false,
          error: result.customerUserErrors[0].message,
        };
      }

      if (result.customerAccessToken) {
        storeAuth(result.customerAccessToken);

        // Fetch customer data
        const customerData = await getCustomer(
          result.customerAccessToken.accessToken
        );
        setCustomer(customerData);

        return { success: true };
      }

      return { success: false, error: "Login failed. Please try again." };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      setIsLoading(true);
      try {
        const result = await customerCreate({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          acceptsMarketing: true,
        });

        if (result.customerUserErrors.length > 0) {
          return {
            success: false,
            error: result.customerUserErrors[0].message,
          };
        }

        if (result.customer) {
          // Auto-login after registration
          const loginResult = await login(data.email, data.password);
          return loginResult;
        }

        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      } catch (error) {
        console.error("Registration error:", error);
        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  const recoverPassword = useCallback(async (email: string) => {
    try {
      const result = await customerRecover(email);

      if (result.customerUserErrors.length > 0) {
        return {
          success: false,
          error: result.customerUserErrors[0].message,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Password recovery error:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }, []);

  const refreshCustomer = useCallback(async () => {
    if (!accessToken) return;

    try {
      const customerData = await getCustomer(accessToken);
      if (customerData) {
        setCustomer(customerData);
      } else {
        clearStoredAuth();
      }
    } catch (error) {
      console.error("Error refreshing customer:", error);
      clearStoredAuth();
    }
  }, [accessToken]);

  // Helper to get customer ID
  const getCustomerId = useCallback(() => {
    // For Google auth, use the Supabase user ID
    if (googleCustomer?.id) {
      return googleCustomer.id;
    }
    if (!customer?.id) return null;
    // Convert "gid://shopify/Customer/123456" to "123456"
    const match = customer.id.match(/Customer\/(\d+)/);
    return match ? match[1] : customer.id;
  }, [customer, googleCustomer]);

  // Sync cart ID to Supabase (for Google auth users)
  const syncCartToCloud = useCallback(
    async (cartId: string | null) => {
      if (authMethod !== "google" || !googleCustomer) return;

      try {
        await fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "cart", data: cartId }),
        });
      } catch (error) {
        console.error("Failed to sync cart to cloud:", error);
      }
    },
    [authMethod, googleCustomer]
  );

  // Sync wishlist to Supabase (for Google auth users)
  const syncWishlistToCloud = useCallback(
    async (productIds: string[]) => {
      if (authMethod !== "google" || !googleCustomer) return;

      try {
        await fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "wishlist", data: productIds }),
        });
      } catch (error) {
        console.error("Failed to sync wishlist to cloud:", error);
      }
    },
    [authMethod, googleCustomer]
  );

  // Google OAuth login with Supabase
  const loginWithGoogle = useCallback(
    async (
      credential: string
    ): Promise<{
      success: boolean;
      error?: string;
      data?: GoogleLoginData;
    }> => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential }),
        });

        const data = await response.json();

        if (!data.success) {
          return {
            success: false,
            error: data.error || "Google login failed. Please try again.",
          };
        }

        // Store Google customer in localStorage
        const googleCustomerData = data.customer as GoogleAuthCustomer;
        localStorage.setItem(
          GOOGLE_CUSTOMER_KEY,
          JSON.stringify(googleCustomerData)
        );
        localStorage.setItem(AUTH_METHOD_KEY, "google");

        setGoogleCustomer(googleCustomerData);
        setAuthMethod("google");

        // Return the saved cart and wishlist data for restoration
        return {
          success: true,
          data: {
            savedCartId: data.savedCartId || null,
            savedWishlistProductIds: data.savedWishlistProductIds || [],
            email: googleCustomerData.email,
          },
        };
      } catch (error) {
        console.error("Google login error:", error);
        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Logout - handle both auth methods
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (authMethod === "google") {
        // Call API to clear httpOnly cookie
        await fetch("/api/auth/google", { method: "DELETE" });
      } else if (accessToken) {
        await customerAccessTokenDelete(accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredAuth();
      setIsLoading(false);
    }
  }, [accessToken, authMethod]);

  return (
    <AuthContext.Provider
      value={{
        customer,
        googleCustomer,
        isLoading,
        isAuthenticated: !!(customer || googleCustomer),
        accessToken,
        authMethod,
        login,
        loginWithGoogle,
        syncCartToCloud,
        syncWishlistToCloud,
        register,
        logout,
        recoverPassword,
        refreshCustomer,
        getCustomerId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
