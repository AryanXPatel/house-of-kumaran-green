"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Edit2,
  Plus,
  Trash2,
  Star,
  Check,
  Loader2,
  ShoppingBag,
  Gift,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  customerUpdate,
  customerAddressCreate,
  customerAddressDelete,
  customerDefaultAddressUpdate,
} from "@/lib/shopify-customer";
import { AddressForm, type AddressFormData } from "@/components/address-form";
import { getStateName } from "@/lib/india-states";

// Shopify store domain for account URLs
const SHOPIFY_STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  "houseofkumaran.myshopify.com";

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "settings";

// Type for Google user's Shopify profile fetched via Admin API
interface GoogleShopifyProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  phone: string | null;
  numberOfOrders: string;
  totalSpent: string;
  defaultAddress: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
    phone: string | null;
  } | null;
  addresses: Array<{
    id: string;
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
    phone: string | null;
  }>;
}

// Type for orders from Admin API
interface GoogleShopifyOrder {
  id: string;
  name: string;
  createdAt: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  totalPriceSet: {
    shopMoney: { amount: string; currencyCode: string };
  };
  lineItems: {
    nodes: Array<{
      title: string;
      quantity: number;
      originalUnitPrice: string;
      discountedUnitPrice: string;
      image?: { url: string; altText: string | null } | null;
      variant?: { title: string; sku: string | null } | null;
    }>;
  };
  shippingAddress: {
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
  fulfillments: Array<{
    status: string;
    trackingInfo: Array<{ number: string; url: string | null }>;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const {
    customer,
    googleCustomer,
    isLoading,
    isAuthenticated,
    authMethod,
    logout,
    accessToken,
    refreshCustomer,
  } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // State for Google user's Shopify profile and orders
  const [googleShopifyProfile, setGoogleShopifyProfile] =
    useState<GoogleShopifyProfile | null>(null);
  const [googleOrders, setGoogleOrders] = useState<GoogleShopifyOrder[]>([]);
  const [isLoadingGoogleProfile, setIsLoadingGoogleProfile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<GoogleShopifyOrder | null>(
    null
  );

  // Kumaran Family membership state
  const [isKumaranFamilyMember, setIsKumaranFamilyMember] = useState<
    boolean | null
  >(null);
  const [isJoiningFamily, setIsJoiningFamily] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    acceptsMarketing: true,
  });

  // Fetch Google user's Shopify profile and orders
  useEffect(() => {
    if (
      authMethod === "google" &&
      googleCustomer &&
      !googleShopifyProfile &&
      !isLoadingGoogleProfile
    ) {
      setIsLoadingGoogleProfile(true);
      // Fetch profile with orders
      fetch("/api/customer/profile?includeOrders=true")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.customer) {
            setGoogleShopifyProfile(data.customer);
            if (data.orders) {
              setGoogleOrders(data.orders);
            }
            // Initialize edit form with Shopify data
            setEditForm({
              firstName: data.customer.firstName || "",
              lastName: data.customer.lastName || "",
              phone: data.customer.phone || "",
              acceptsMarketing: true, // Default for Google users
            });
          }
        })
        .catch((err) => console.error("Failed to fetch Shopify profile:", err))
        .finally(() => setIsLoadingGoogleProfile(false));
    }
  }, [
    authMethod,
    googleCustomer,
    googleShopifyProfile,
    isLoadingGoogleProfile,
  ]);

  // Refresh Google profile after changes
  const refreshGoogleProfile = async () => {
    if (authMethod !== "google") return;
    try {
      const res = await fetch("/api/customer/profile?includeOrders=true");
      const data = await res.json();
      if (data.success && data.customer) {
        setGoogleShopifyProfile(data.customer);
        if (data.orders) {
          setGoogleOrders(data.orders);
        }
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Initialize edit form when customer data is loaded (email auth)
  useEffect(() => {
    if (customer) {
      setEditForm({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phone: customer.phone || "",
        acceptsMarketing: customer.acceptsMarketing,
      });
    }
  }, [customer]);

  // Check Kumaran Family membership
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkMembership = async () => {
      try {
        const res = await fetch("/api/customer/join-family");
        const data = await res.json();
        setIsKumaranFamilyMember(data.isMember);
      } catch (err) {
        console.error("Failed to check membership:", err);
      }
    };

    checkMembership();
  }, [isAuthenticated]);

  // Handler to join Kumaran Family
  const handleJoinFamily = async () => {
    setIsJoiningFamily(true);
    try {
      const res = await fetch("/api/customer/join-family", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIsKumaranFamilyMember(true);
      }
    } catch (err) {
      console.error("Failed to join Kumaran Family:", err);
    } finally {
      setIsJoiningFamily(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!accessToken) return;
    setIsSaving(true);
    try {
      const result = await customerUpdate(accessToken, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone || undefined,
        acceptsMarketing: editForm.acceptsMarketing,
      });
      if (result.customer) {
        await refreshCustomer();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsSaving(false);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!accessToken) return;
    try {
      await customerAddressDelete(accessToken, addressId);
      await refreshCustomer();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!accessToken) return;
    try {
      await customerDefaultAddressUpdate(accessToken, addressId);
      await refreshCustomer();
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-[#b8860b] animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  // Don't render if no authentication
  if (!customer && !googleCustomer) return null;

  // Tabs - filter based on auth method
  // Google users can now see orders AND addresses via Admin API
  const allTabs = [
    {
      id: "overview" as Tab,
      label: "Overview",
      icon: User,
      showFor: ["email", "google"],
    },
    {
      id: "orders" as Tab,
      label: "Orders",
      icon: Package,
      showFor: ["email", "google"],
    },
    {
      id: "wishlist" as Tab,
      label: "Wishlist",
      icon: Heart,
      showFor: ["email", "google"],
    },
    {
      id: "addresses" as Tab,
      label: "Addresses",
      icon: MapPin,
      showFor: ["email", "google"],
    },
    {
      id: "settings" as Tab,
      label: "Settings",
      icon: Settings,
      showFor: ["email", "google"],
    },
  ];

  const tabs = allTabs.filter(
    (tab) => authMethod && tab.showFor.includes(authMethod)
  );

  // Helper function to get address count for display
  const getAddressCount = () => {
    if (authMethod === "email" && customer) {
      return customer.addresses?.edges?.length ?? 0;
    }
    if (authMethod === "google" && googleShopifyProfile) {
      return googleShopifyProfile.addresses?.length ?? 0;
    }
    return 0;
  };

  // Helper function to get order count for display
  const getOrderCount = () => {
    if (authMethod === "email" && customer) {
      return customer.orders?.edges?.length ?? 0;
    }
    if (authMethod === "google" && googleShopifyProfile) {
      return parseInt(googleShopifyProfile.numberOfOrders) || 0;
    }
    return 0;
  };

  return (
    <main className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
      <Navbar />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="text-[#b8860b] text-sm tracking-[0.2em] uppercase mb-2">
              My Account
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Welcome back,{" "}
              {customer?.firstName ||
                googleCustomer?.name?.split(" ")[0] ||
                "there"}
              !
            </h1>
            {authMethod === "google" && (
              <p className="text-[#b8860b]/70 text-sm mt-1 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Signed in with Google
              </p>
            )}
          </div>

          {/* Kumaran Family Banner */}
          {isKumaranFamilyMember === true && (
            <div className="mb-10 p-6 bg-gradient-to-r from-[#b8860b]/20 to-[#b8860b]/10 rounded-2xl border border-[#b8860b]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#b8860b]/30 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-[#b8860b]" />
                </div>
                <div>
                  <p className="font-semibold text-[#f5f0e1]">
                    You&apos;re part of the Kumaran Family!
                  </p>
                  <p className="text-[#f5f0e1]/60 text-sm">
                    Enjoy 5% off on all orders + exclusive early access to new
                    products
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Join Kumaran Family Prompt (for non-members) */}
          {isKumaranFamilyMember === false && (
            <div className="mb-10 p-6 bg-[#1a472a]/30 rounded-2xl border border-[#2a4a35]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#b8860b]/20 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-[#b8860b]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#f5f0e1]">
                      Join the Kumaran Family
                    </p>
                    <p className="text-[#f5f0e1]/60 text-sm">
                      Get 5% off forever, early access to new products &
                      exclusive recipes
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleJoinFamily}
                  disabled={isJoiningFamily}
                  className="px-6 py-3 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {isJoiningFamily ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      Join Now - It&apos;s Free!
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-28 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        activeTab === tab.id
                          ? "bg-[#b8860b] text-[#0d1f14] font-semibold"
                          : "text-[#f5f0e1]/70 hover:bg-[#1a472a]/30 hover:text-[#f5f0e1]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                      {tab.id === "wishlist" && wishlistItems.length > 0 && (
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                            activeTab === tab.id
                              ? "bg-[#0d1f14]/20"
                              : "bg-[#b8860b]/20 text-[#b8860b]"
                          }`}
                        >
                          {wishlistItems.length}
                        </span>
                      )}
                      {tab.id === "orders" &&
                        authMethod === "email" &&
                        customer &&
                        customer.orders?.edges?.length > 0 && (
                          <span
                            className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                              activeTab === tab.id
                                ? "bg-[#0d1f14]/20"
                                : "bg-[#b8860b]/20 text-[#b8860b]"
                            }`}
                          >
                            {customer.orders.edges.length}
                          </span>
                        )}
                    </button>
                  );
                })}

                <hr className="border-[#2a4a35] my-4" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>

                {/* Only show Shopify account link for email auth */}
                {authMethod === "email" && (
                  <a
                    href={`https://${SHOPIFY_STORE_DOMAIN}/account`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#f5f0e1]/50 hover:text-[#f5f0e1] hover:bg-[#1a472a]/30 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Shopify Account
                  </a>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Loading state for Google profile */}
                  {authMethod === "google" && isLoadingGoogleProfile && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 text-[#b8860b] animate-spin" />
                      <span className="ml-3 text-[#f5f0e1]/70">
                        Loading your Shopify profile...
                      </span>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Orders */}
                    <div className="p-4 bg-[#1a472a]/30 rounded-xl border border-[#2a4a35]">
                      <Package className="w-5 h-5 text-[#b8860b] mb-2" />
                      <p className="text-2xl font-bold">{getOrderCount()}</p>
                      <p className="text-[#f5f0e1]/50 text-sm">Total Orders</p>
                    </div>
                    <div className="p-4 bg-[#1a472a]/30 rounded-xl border border-[#2a4a35]">
                      <Heart className="w-5 h-5 text-[#b8860b] mb-2" />
                      <p className="text-2xl font-bold">
                        {wishlistItems.length}
                      </p>
                      <p className="text-[#f5f0e1]/50 text-sm">
                        Wishlist Items
                      </p>
                    </div>
                    {/* Addresses */}
                    <div className="p-4 bg-[#1a472a]/30 rounded-xl border border-[#2a4a35]">
                      <MapPin className="w-5 h-5 text-[#b8860b] mb-2" />
                      <p className="text-2xl font-bold">{getAddressCount()}</p>
                      <p className="text-[#f5f0e1]/50 text-sm">
                        Saved Addresses
                      </p>
                    </div>
                    <div className="p-4 bg-[#1a472a]/30 rounded-xl border border-[#2a4a35]">
                      <Star className="w-5 h-5 text-[#b8860b] mb-2" />
                      <p className="text-2xl font-bold">5%</p>
                      <p className="text-[#f5f0e1]/50 text-sm">
                        Family Discount
                      </p>
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">
                        Profile Information
                      </h3>
                      {/* Only show edit button for email auth users */}
                      {authMethod === "email" && (
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="text-[#b8860b] hover:text-[#d4a017] text-sm flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          {isEditing ? "Cancel" : "Edit"}
                        </button>
                      )}
                    </div>

                    {isEditing && authMethod === "email" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#f5f0e1]/70 text-sm mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={editForm.firstName}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  firstName: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[#f5f0e1]/70 text-sm mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={editForm.lastName}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  lastName: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[#f5f0e1]/70 text-sm mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="marketing"
                            checked={editForm.acceptsMarketing}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                acceptsMarketing: e.target.checked,
                              })
                            }
                            className="w-4 h-4 accent-[#b8860b]"
                          />
                          <label
                            htmlFor="marketing"
                            className="text-[#f5f0e1]/70 text-sm"
                          >
                            Receive updates about new products and offers
                          </label>
                        </div>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="px-6 py-2 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Google user profile with avatar */}
                        {authMethod === "google" && googleCustomer && (
                          <>
                            <div className="flex items-center gap-3 mb-4">
                              {googleCustomer.picture ? (
                                <img
                                  src={googleCustomer.picture}
                                  alt="Profile"
                                  className="w-12 h-12 rounded-full border-2 border-[#b8860b]/50"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-[#b8860b]/20 flex items-center justify-center border-2 border-[#b8860b]/50">
                                  <User className="w-6 h-6 text-[#b8860b]" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-lg">
                                  {googleCustomer.name}
                                </p>
                                <span className="text-xs text-[#b8860b]">
                                  Google Account
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-[#b8860b]" />
                              <span>{googleCustomer.email}</span>
                            </div>
                          </>
                        )}
                        {/* Shopify email user profile */}
                        {authMethod === "email" && customer && (
                          <>
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-[#b8860b]" />
                              <span>
                                {customer.firstName} {customer.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-[#b8860b]" />
                              <span>{customer.email}</span>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#b8860b]" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Recent Orders - Only for email auth users with orders */}
                  {authMethod === "email" &&
                    customer &&
                    customer.orders?.edges &&
                    customer.orders.edges.length > 0 && (
                      <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">
                            Recent Orders
                          </h3>
                          <button
                            onClick={() => setActiveTab("orders")}
                            className="text-[#b8860b] hover:text-[#d4a017] text-sm flex items-center gap-1"
                          >
                            View All
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {customer.orders.edges
                            .slice(0, 3)
                            .map(({ node: order }) => (
                              <div
                                key={order.id}
                                className="flex items-center justify-between p-4 bg-[#0d1f14]/50 rounded-xl"
                              >
                                <div>
                                  <p className="font-medium">
                                    Order #{order.orderNumber}
                                  </p>
                                  <p className="text-[#f5f0e1]/50 text-sm flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(
                                      order.processedAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-[#b8860b]">
                                    ₹
                                    {parseFloat(
                                      order.totalPrice.amount
                                    ).toFixed(0)}
                                  </p>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      order.fulfillmentStatus === "FULFILLED"
                                        ? "bg-green-500/20 text-green-400"
                                        : order.fulfillmentStatus ===
                                          "IN_PROGRESS"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-[#b8860b]/20 text-[#b8860b]"
                                    }`}
                                  >
                                    {order.fulfillmentStatus
                                      .toLowerCase()
                                      .replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Orders Tab - Only accessible for email auth users */}
              {activeTab === "orders" && authMethod === "email" && customer && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold">
                    Order History
                  </h2>

                  {customer.orders.edges.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="w-16 h-16 text-[#b8860b]/30 mx-auto mb-4" />
                      <h3 className="font-serif text-xl mb-2">No orders yet</h3>
                      <p className="text-[#f5f0e1]/50 mb-6">
                        Start shopping to see your orders here
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customer.orders.edges.map(({ node: order }) => (
                        <div
                          key={order.id}
                          className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <p className="font-semibold text-lg">
                                Order #{order.orderNumber}
                              </p>
                              <p className="text-[#f5f0e1]/50 text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.processedAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  order.fulfillmentStatus === "FULFILLED"
                                    ? "bg-green-500/20 text-green-400"
                                    : order.fulfillmentStatus === "IN_PROGRESS"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-[#b8860b]/20 text-[#b8860b]"
                                }`}
                              >
                                {order.fulfillmentStatus
                                  .toLowerCase()
                                  .replace("_", " ")}
                              </span>
                              <p className="font-bold text-xl text-[#b8860b]">
                                ₹
                                {parseFloat(order.totalPrice.amount).toFixed(0)}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.lineItems.edges.map(({ node: item }, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 bg-[#0d1f14]/50 rounded-xl"
                              >
                                {item.variant?.image?.url && (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1a472a]">
                                    <Image
                                      src={item.variant.image.url}
                                      alt={item.title}
                                      width={48}
                                      height={48}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-[#f5f0e1]/50 text-xs">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-[#2a4a35] flex items-center justify-between">
                            <Link
                              href="/track"
                              className="text-[#b8860b] hover:text-[#d4a017] text-sm flex items-center gap-1"
                            >
                              <Clock className="w-4 h-4" />
                              Track Order
                            </Link>
                            <a
                              href={`https://${SHOPIFY_STORE_DOMAIN}/account/orders`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f5f0e1]/50 hover:text-[#f5f0e1] text-sm flex items-center gap-1"
                            >
                              View Details
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab - For Google auth users (via Admin API) */}
              {activeTab === "orders" && authMethod === "google" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold">
                    Order History
                  </h2>

                  {/* Loading state */}
                  {isLoadingGoogleProfile && (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 text-[#b8860b] animate-spin" />
                      <span className="ml-3 text-[#f5f0e1]/70">
                        Loading orders...
                      </span>
                    </div>
                  )}

                  {/* Order Detail Modal */}
                  {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                      <div className="bg-[#0d1f14] border border-[#2a4a35] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-xl font-bold">
                              Order {selectedOrder.name}
                            </h3>
                            <button
                              onClick={() => setSelectedOrder(null)}
                              className="text-[#f5f0e1]/50 hover:text-[#f5f0e1]"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Order Status */}
                          <div className="flex gap-3 mb-6">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedOrder.displayFinancialStatus === "PAID"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {selectedOrder.displayFinancialStatus.toLowerCase()}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedOrder.displayFulfillmentStatus ===
                                "FULFILLED"
                                  ? "bg-green-500/20 text-green-400"
                                  : selectedOrder.displayFulfillmentStatus ===
                                    "IN_PROGRESS"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-[#b8860b]/20 text-[#b8860b]"
                              }`}
                            >
                              {selectedOrder.displayFulfillmentStatus
                                .toLowerCase()
                                .replace("_", " ")}
                            </span>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3 mb-6">
                            <h4 className="font-semibold text-sm text-[#f5f0e1]/70">
                              Items
                            </h4>
                            {selectedOrder.lineItems.nodes.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-4 p-3 bg-[#1a472a]/30 rounded-xl"
                              >
                                {item.image && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1a472a]">
                                    <Image
                                      src={item.image.url}
                                      alt={item.title}
                                      width={64}
                                      height={64}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{item.title}</p>
                                  {item.variant && (
                                    <p className="text-[#f5f0e1]/50 text-sm">
                                      {item.variant.title}
                                    </p>
                                  )}
                                  <p className="text-[#f5f0e1]/50 text-sm">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-bold text-[#b8860b]">
                                  ₹
                                  {parseFloat(item.discountedUnitPrice).toFixed(
                                    0
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Shipping Address */}
                          {selectedOrder.shippingAddress && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-sm text-[#f5f0e1]/70 mb-2">
                                Shipping Address
                              </h4>
                              <div className="p-3 bg-[#1a472a]/20 rounded-xl text-sm">
                                <p>
                                  {selectedOrder.shippingAddress.firstName}{" "}
                                  {selectedOrder.shippingAddress.lastName}
                                </p>
                                <p className="text-[#f5f0e1]/70">
                                  {selectedOrder.shippingAddress.address1}
                                  <br />
                                  {selectedOrder.shippingAddress.city},{" "}
                                  {selectedOrder.shippingAddress.province}{" "}
                                  {selectedOrder.shippingAddress.zip}
                                  <br />
                                  {selectedOrder.shippingAddress.country}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Tracking Info */}
                          {selectedOrder.fulfillments.length > 0 &&
                            selectedOrder.fulfillments[0].trackingInfo.length >
                              0 && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-sm text-[#f5f0e1]/70 mb-2">
                                  Tracking
                                </h4>
                                {selectedOrder.fulfillments[0].trackingInfo.map(
                                  (track, i) => (
                                    <div
                                      key={i}
                                      className="p-3 bg-[#1a472a]/20 rounded-xl"
                                    >
                                      <p className="font-mono text-sm">
                                        {track.number}
                                      </p>
                                      {track.url && (
                                        <a
                                          href={track.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#b8860b] hover:text-[#d4a017] text-sm flex items-center gap-1 mt-1"
                                        >
                                          Track Package{" "}
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {/* Order Total */}
                          <div className="pt-4 border-t border-[#2a4a35]">
                            <div className="flex justify-between items-center">
                              <span className="text-[#f5f0e1]/70">Total</span>
                              <span className="font-bold text-xl text-[#b8860b]">
                                ₹
                                {parseFloat(
                                  selectedOrder.totalPriceSet.shopMoney.amount
                                ).toFixed(0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No orders */}
                  {!isLoadingGoogleProfile && googleOrders.length === 0 && (
                    <div className="text-center py-16">
                      <Package className="w-16 h-16 text-[#b8860b]/30 mx-auto mb-4" />
                      <h3 className="font-serif text-xl mb-2">No orders yet</h3>
                      <p className="text-[#f5f0e1]/50 mb-6">
                        Start shopping to see your orders here
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Browse Products
                      </Link>
                    </div>
                  )}

                  {/* Orders List */}
                  {!isLoadingGoogleProfile && googleOrders.length > 0 && (
                    <div className="space-y-4">
                      {googleOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <p className="font-semibold text-lg">
                                Order {order.name}
                              </p>
                              <p className="text-[#f5f0e1]/50 text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  order.displayFulfillmentStatus === "FULFILLED"
                                    ? "bg-green-500/20 text-green-400"
                                    : order.displayFulfillmentStatus ===
                                      "IN_PROGRESS"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-[#b8860b]/20 text-[#b8860b]"
                                }`}
                              >
                                {order.displayFulfillmentStatus
                                  .toLowerCase()
                                  .replace("_", " ")}
                              </span>
                              <p className="font-bold text-xl text-[#b8860b]">
                                ₹
                                {parseFloat(
                                  order.totalPriceSet.shopMoney.amount
                                ).toFixed(0)}
                              </p>
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.lineItems.nodes
                              .slice(0, 3)
                              .map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-3 bg-[#0d1f14]/50 rounded-xl"
                                >
                                  {item.image && (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1a472a]">
                                      <Image
                                        src={item.image.url}
                                        alt={item.title}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {item.title}
                                    </p>
                                    <p className="text-[#f5f0e1]/50 text-xs">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            {order.lineItems.nodes.length > 3 && (
                              <div className="flex items-center justify-center p-3 bg-[#0d1f14]/50 rounded-xl text-[#f5f0e1]/50 text-sm">
                                +{order.lineItems.nodes.length - 3} more items
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t border-[#2a4a35] flex items-center justify-between">
                            <Link
                              href="/track"
                              className="text-[#b8860b] hover:text-[#d4a017] text-sm flex items-center gap-1"
                            >
                              <Clock className="w-4 h-4" />
                              Track Order
                            </Link>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-[#f5f0e1]/50 hover:text-[#f5f0e1] text-sm flex items-center gap-1"
                            >
                              View Details
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold">My Wishlist</h2>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart className="w-16 h-16 text-[#b8860b]/30 mx-auto mb-4" />
                      <h3 className="font-serif text-xl mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-[#f5f0e1]/50 mb-6">
                        Save items you love for later
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Explore Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map((product) => (
                        <div
                          key={product.id}
                          className="p-4 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35] group"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                          <h3 className="font-semibold mb-1">{product.name}</h3>
                          <p className="text-[#f5f0e1]/50 text-sm mb-2">
                            {product.weight}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#b8860b] font-bold text-lg">
                              ₹{product.price}
                            </span>
                            <Link
                              href={`/product/${product.slug}`}
                              className="px-4 py-2 bg-[#b8860b] text-[#0d1f14] text-sm font-semibold rounded-full hover:bg-[#d4a017] transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab - Only accessible for email auth users */}
              {activeTab === "addresses" &&
                authMethod === "email" &&
                customer && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-2xl font-bold">
                        Saved Addresses
                      </h2>
                      <button
                        onClick={() => setShowAddAddress(true)}
                        className="px-4 py-2 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Address
                      </button>
                    </div>

                    {/* Add Address Form */}
                    {showAddAddress && (
                      <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/30">
                        <h3 className="font-semibold mb-4">Add New Address</h3>
                        <AddressForm
                          onSubmit={async (data: AddressFormData) => {
                            if (!accessToken) return;
                            const result = await customerAddressCreate(
                              accessToken,
                              data
                            );
                            if (result.customerAddress) {
                              await refreshCustomer();
                              setShowAddAddress(false);
                            }
                          }}
                          onCancel={() => setShowAddAddress(false)}
                          isSubmitting={isSaving}
                        />
                      </div>
                    )}

                    {/* Address List */}
                    {customer.addresses.edges.length === 0 &&
                    !showAddAddress ? (
                      <div className="text-center py-16">
                        <MapPin className="w-16 h-16 text-[#b8860b]/30 mx-auto mb-4" />
                        <h3 className="font-serif text-xl mb-2">
                          No saved addresses
                        </h3>
                        <p className="text-[#f5f0e1]/50">
                          Add an address for faster checkout
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customer.addresses.edges.map(({ node: address }) => {
                          const isDefault =
                            customer.defaultAddress?.id === address.id;
                          return (
                            <div
                              key={address.id}
                              className={`p-5 rounded-2xl border ${
                                isDefault
                                  ? "bg-[#b8860b]/10 border-[#b8860b]/40"
                                  : "bg-[#1a472a]/20 border-[#2a4a35]"
                              }`}
                            >
                              {isDefault && (
                                <span className="inline-block px-2 py-0.5 bg-[#b8860b] text-[#0d1f14] text-xs font-bold rounded-full mb-3">
                                  Default
                                </span>
                              )}
                              <p className="font-semibold">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-[#f5f0e1]/70 text-sm mt-1">
                                {address.address1}
                                {address.address2 && `, ${address.address2}`}
                                <br />
                                {address.city}, {address.province} {address.zip}
                                <br />
                                {address.country}
                              </p>
                              {address.phone && (
                                <p className="text-[#f5f0e1]/50 text-sm mt-1">
                                  {address.phone}
                                </p>
                              )}
                              <div className="flex gap-2 mt-4">
                                {!isDefault && (
                                  <button
                                    onClick={() =>
                                      handleSetDefaultAddress(address.id)
                                    }
                                    className="text-[#b8860b] hover:text-[#d4a017] text-sm"
                                  >
                                    Set as Default
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleDeleteAddress(address.id)
                                  }
                                  className="text-red-400 hover:text-red-300 text-sm ml-auto"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              {/* Addresses Tab - For Google auth users (via Admin API) */}
              {activeTab === "addresses" && authMethod === "google" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-bold">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="px-4 py-2 bg-[#b8860b] text-[#0d1f14] font-semibold rounded-full hover:bg-[#d4a017] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Address
                    </button>
                  </div>

                  {/* Add Address Form for Google Users */}
                  {showAddAddress && (
                    <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#b8860b]/30">
                      <h3 className="font-semibold mb-4">Add New Address</h3>
                      <AddressForm
                        onSubmit={async (data: AddressFormData) => {
                          try {
                            const res = await fetch("/api/customer/profile", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ address: data }),
                            });
                            const result = await res.json();
                            if (result.success) {
                              await refreshGoogleProfile();
                              setShowAddAddress(false);
                            } else {
                              console.error(
                                "Failed to add address:",
                                result.error
                              );
                              alert(result.error || "Failed to add address");
                            }
                          } catch (err) {
                            console.error("Failed to add address:", err);
                            alert("Failed to add address. Please try again.");
                          }
                        }}
                        onCancel={() => setShowAddAddress(false)}
                        isSubmitting={isSaving}
                      />
                    </div>
                  )}

                  {/* Loading state */}
                  {isLoadingGoogleProfile && (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 text-[#b8860b] animate-spin" />
                      <span className="ml-3 text-[#f5f0e1]/70">
                        Loading addresses...
                      </span>
                    </div>
                  )}

                  {/* No Shopify profile linked */}
                  {!isLoadingGoogleProfile && !googleShopifyProfile && (
                    <div className="text-center py-16">
                      <MapPin className="w-16 h-16 text-[#b8860b]/30 mx-auto mb-4" />
                      <h3 className="font-serif text-xl mb-2">
                        No Shopify account linked
                      </h3>
                      <p className="text-[#f5f0e1]/50">
                        Your addresses will sync after your first order
                      </p>
                    </div>
                  )}

                  {/* Address List from Shopify Admin API */}
                  {!isLoadingGoogleProfile && googleShopifyProfile && (
                    <>
                      {googleShopifyProfile.addresses.length === 0 &&
                      !showAddAddress ? (
                        <div className="text-center py-16">
                          <MapPin className="w-16 h-16 text-[#b8860b]/30 mx-auto mb-4" />
                          <h3 className="font-serif text-xl mb-2">
                            No saved addresses
                          </h3>
                          <p className="text-[#f5f0e1]/50">
                            Add an address for faster checkout
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {googleShopifyProfile.addresses.map((address) => {
                            const isDefault =
                              googleShopifyProfile.defaultAddress?.id ===
                              address.id;
                            return (
                              <div
                                key={address.id}
                                className={`p-5 rounded-2xl border ${
                                  isDefault
                                    ? "bg-[#b8860b]/10 border-[#b8860b]/40"
                                    : "bg-[#1a472a]/20 border-[#2a4a35]"
                                }`}
                              >
                                {isDefault && (
                                  <span className="inline-block px-2 py-0.5 bg-[#b8860b] text-[#0d1f14] text-xs font-bold rounded-full mb-3">
                                    Default
                                  </span>
                                )}
                                <p className="font-semibold">
                                  {address.firstName} {address.lastName}
                                </p>
                                <p className="text-[#f5f0e1]/70 text-sm mt-1">
                                  {address.address1}
                                  {address.address2 && `, ${address.address2}`}
                                  <br />
                                  {address.city}, {address.province}{" "}
                                  {address.zip}
                                  <br />
                                  {address.country}
                                </p>
                                {address.phone && (
                                  <p className="text-[#f5f0e1]/50 text-sm mt-1">
                                    {address.phone}
                                  </p>
                                )}
                                <div className="flex gap-2 mt-4">
                                  {!isDefault && (
                                    <button
                                      onClick={async () => {
                                        try {
                                          const res = await fetch(
                                            "/api/customer/profile",
                                            {
                                              method: "PATCH",
                                              headers: {
                                                "Content-Type":
                                                  "application/json",
                                              },
                                              body: JSON.stringify({
                                                addressId: address.id,
                                                setAsDefault: true,
                                              }),
                                            }
                                          );
                                          const data = await res.json();
                                          if (data.success) {
                                            await refreshGoogleProfile();
                                          }
                                        } catch (err) {
                                          console.error(
                                            "Failed to set default:",
                                            err
                                          );
                                        }
                                      }}
                                      className="text-[#b8860b] hover:text-[#d4a017] text-sm"
                                    >
                                      Set as Default
                                    </button>
                                  )}
                                  <button
                                    onClick={async () => {
                                      if (
                                        !confirm(
                                          "Are you sure you want to delete this address?"
                                        )
                                      )
                                        return;
                                      try {
                                        const res = await fetch(
                                          `/api/customer/profile?addressId=${address.id}`,
                                          {
                                            method: "DELETE",
                                          }
                                        );
                                        const data = await res.json();
                                        if (data.success) {
                                          await refreshGoogleProfile();
                                        }
                                      } catch (err) {
                                        console.error("Failed to delete:", err);
                                      }
                                    }}
                                    className="text-red-400 hover:text-red-300 text-sm ml-auto"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold">
                    Account Settings
                  </h2>

                  {/* Email Preferences - Only for Shopify email auth */}
                  {authMethod === "email" && customer && (
                    <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]">
                      <h3 className="font-semibold text-lg mb-4">
                        Email Preferences
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customer.acceptsMarketing}
                            onChange={async (e) => {
                              if (accessToken) {
                                await customerUpdate(accessToken, {
                                  acceptsMarketing: e.target.checked,
                                });
                                await refreshCustomer();
                              }
                            }}
                            className="w-5 h-5 accent-[#b8860b]"
                          />
                          <div>
                            <p className="font-medium">Marketing emails</p>
                            <p className="text-[#f5f0e1]/50 text-sm">
                              Receive updates about new products and offers
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Account Info */}
                  <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]">
                    <h3 className="font-semibold text-lg mb-4">
                      Account Information
                    </h3>
                    <div className="space-y-4">
                      {authMethod === "google" && googleCustomer && (
                        <>
                          <div className="flex items-center gap-4 mb-4">
                            {googleCustomer.picture ? (
                              <img
                                src={googleCustomer.picture}
                                alt="Profile"
                                className="w-16 h-16 rounded-full border-2 border-[#b8860b]/50"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-[#b8860b]/20 flex items-center justify-center border-2 border-[#b8860b]/50">
                                <User className="w-8 h-8 text-[#b8860b]" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-lg">
                                {googleCustomer.name}
                              </p>
                              <p className="text-[#b8860b] text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                  />
                                </svg>
                                Connected with Google
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[#f5f0e1]/70 mb-1 text-sm">
                              Email Address
                            </p>
                            <p className="font-medium">
                              {googleCustomer.email}
                            </p>
                          </div>
                          <p className="text-[#f5f0e1]/50 text-sm">
                            Your profile is managed through your Google account.
                            To update your name or profile picture, please
                            update your Google account settings.
                          </p>
                        </>
                      )}
                      {authMethod === "email" && customer && (
                        <>
                          <div>
                            <p className="text-[#f5f0e1]/70 mb-2">
                              Email Address
                            </p>
                            <p className="font-medium">{customer.email}</p>
                          </div>
                          <a
                            href={`https://${SHOPIFY_STORE_DOMAIN}/account`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-[#2a4a35] hover:border-[#b8860b] rounded-full text-sm transition-colors"
                          >
                            Change Password
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]">
                    <h3 className="font-semibold text-lg mb-4">Session</h3>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 border border-[#2a4a35] hover:border-red-500/50 hover:text-red-400 rounded-full text-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>

                  {/* Danger Zone - Only for Shopify email auth */}
                  {authMethod === "email" && (
                    <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
                      <h3 className="font-semibold text-lg mb-4 text-red-400">
                        Danger Zone
                      </h3>
                      <p className="text-[#f5f0e1]/60 text-sm mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <a
                        href={`https://${SHOPIFY_STORE_DOMAIN}/account`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 rounded-full text-sm transition-colors"
                      >
                        Delete Account
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
