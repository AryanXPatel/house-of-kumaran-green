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

interface AuthContextType {
  customer: ShopifyCustomer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Load token from storage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadStoredAuth = async () => {
      try {
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
    setAccessToken(null);
    setCustomer(null);
  };

  const storeAuth = (token: CustomerAccessToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.accessToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, token.expiresAt);
    setAccessToken(token.accessToken);
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

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (accessToken) {
        await customerAccessTokenDelete(accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredAuth();
      setIsLoading(false);
    }
  }, [accessToken]);

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

  // Helper to get customer ID from the Shopify GID
  const getCustomerId = useCallback(() => {
    if (!customer?.id) return null;
    // Convert "gid://shopify/Customer/123456" to "123456"
    const match = customer.id.match(/Customer\/(\d+)/);
    return match ? match[1] : customer.id;
  }, [customer]);

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        accessToken,
        login,
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
