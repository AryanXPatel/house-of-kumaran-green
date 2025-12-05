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

// Shopify store domain for account URLs
const SHOPIFY_STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  "houseofkumaran.myshopify.com";

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "settings";

export default function AccountPage() {
  const router = useRouter();
  const {
    customer,
    isLoading,
    isAuthenticated,
    logout,
    accessToken,
    refreshCustomer,
  } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    acceptsMarketing: true,
  });
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "India",
    zip: "",
    phone: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Initialize edit form when customer data is loaded
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

  const handleAddAddress = async () => {
    if (!accessToken) return;
    setIsSaving(true);
    try {
      const result = await customerAddressCreate(accessToken, addressForm);
      if (result.customerAddress) {
        await refreshCustomer();
        setShowAddAddress(false);
        setAddressForm({
          firstName: "",
          lastName: "",
          address1: "",
          address2: "",
          city: "",
          province: "",
          country: "India",
          zip: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error adding address:", error);
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

  if (!customer) return null;

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: User },
    { id: "orders" as Tab, label: "Orders", icon: Package },
    { id: "wishlist" as Tab, label: "Wishlist", icon: Heart },
    { id: "addresses" as Tab, label: "Addresses", icon: MapPin },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

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
              Welcome back, {customer.firstName || "there"}!
            </h1>
          </div>

          {/* Kumaran Family Banner */}
          <div className="mb-10 p-6 bg-gradient-to-r from-[#b8860b]/20 to-[#b8860b]/10 rounded-2xl border border-[#b8860b]/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#b8860b]/30 flex items-center justify-center">
                <Gift className="w-6 h-6 text-[#b8860b]" />
              </div>
              <div>
                <p className="font-semibold text-[#f5f0e1]">
                  You&apos;re part of the Kumaran Family! 🎉
                </p>
                <p className="text-[#f5f0e1]/60 text-sm">
                  Enjoy 5% off on all orders + exclusive early access to new
                  products
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
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
                        customer.orders.edges.length > 0 && (
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

                <a
                  href={`https://${SHOPIFY_STORE_DOMAIN}/account`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#f5f0e1]/50 hover:text-[#f5f0e1] hover:bg-[#1a472a]/30 rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Shopify Account
                </a>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#1a472a]/30 rounded-xl border border-[#2a4a35]">
                      <Package className="w-5 h-5 text-[#b8860b] mb-2" />
                      <p className="text-2xl font-bold">
                        {customer.orders.edges.length}
                      </p>
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
                    <div className="p-4 bg-[#1a472a]/30 rounded-xl border border-[#2a4a35]">
                      <MapPin className="w-5 h-5 text-[#b8860b] mb-2" />
                      <p className="text-2xl font-bold">
                        {customer.addresses.edges.length}
                      </p>
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
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-[#b8860b] hover:text-[#d4a017] text-sm flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        {isEditing ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    {isEditing ? (
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
                      </div>
                    )}
                  </div>

                  {/* Recent Orders */}
                  {customer.orders.edges.length > 0 && (
                    <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Recent Orders</h3>
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
                                  {parseFloat(order.totalPrice.amount).toFixed(
                                    0
                                  )}
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

              {/* Orders Tab */}
              {activeTab === "orders" && (
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

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={addressForm.firstName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              firstName: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={addressForm.lastName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              lastName: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Address Line 1"
                          value={addressForm.address1}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              address1: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none md:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="Address Line 2 (Optional)"
                          value={addressForm.address2}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              address2: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none md:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={addressForm.province}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              province: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="PIN Code"
                          value={addressForm.zip}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              zip: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-[#0d1f14] border border-[#2a4a35] rounded-lg text-[#f5f0e1] focus:border-[#b8860b] focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleAddAddress}
                          disabled={isSaving}
                          className="px-6 py-2 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Save Address
                        </button>
                        <button
                          onClick={() => setShowAddAddress(false)}
                          className="px-6 py-2 border border-[#2a4a35] text-[#f5f0e1] rounded-full hover:border-[#b8860b]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Address List */}
                  {customer.addresses.edges.length === 0 && !showAddAddress ? (
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
                                onClick={() => handleDeleteAddress(address.id)}
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

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold">
                    Account Settings
                  </h2>

                  {/* Email Preferences */}
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

                  {/* Account Security */}
                  <div className="p-6 bg-[#1a472a]/20 rounded-2xl border border-[#2a4a35]">
                    <h3 className="font-semibold text-lg mb-4">
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[#f5f0e1]/70 mb-2">Email Address</p>
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
                    </div>
                  </div>

                  {/* Danger Zone */}
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
