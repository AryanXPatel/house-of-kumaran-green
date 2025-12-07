"use client";

import { useState } from "react";
import Link from "next/link";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Package,
  Heart,
  MapPin,
  ChevronRight,
  ExternalLink,
  Settings,
  Crown,
  Percent,
  Sparkles,
  Gift,
  Users,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useShopifyCart } from "@/lib/shopify-cart-context";
import { useWishlist } from "@/lib/wishlist-context";

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWishlist: () => void;
}

type AuthMode = "login" | "register" | "forgot-password" | "account";

// Shopify store domain for account URLs
const SHOPIFY_STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  "houseofkumaran.myshopify.com";
const SHOPIFY_ACCOUNT_URL = `https://${SHOPIFY_STORE_DOMAIN}/account`;
const SHOPIFY_LOGIN_URL = `https://${SHOPIFY_STORE_DOMAIN}/account/login`;

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthDrawer({
  isOpen,
  onClose,
  onOpenWishlist,
}: AuthDrawerProps) {
  const {
    customer,
    googleCustomer,
    isLoading,
    isAuthenticated,
    authMethod,
    login,
    loginWithGoogle,
    register,
    logout,
    recoverPassword,
  } = useAuth();
  const { restoreCartFromCloud, associateBuyerIdentity } = useShopifyCart();
  const { restoreWishlistFromCloud } = useWishlist();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinKumaranFamily, setJoinKumaranFamily] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setError(result.error || "Login failed");
    }
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await register(formData, joinKumaranFamily);
    if (!result.success) {
      setError(result.error || "Registration failed");
    }
    setIsSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const result = await recoverPassword(formData.email);
    if (result.success) {
      setSuccess("Check your email for password reset instructions");
    } else {
      setError(result.error || "Failed to send reset email");
    }
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    await logout();
    setMode("login");
  };

  // Handle Google OAuth success
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) {
      setError("Google login failed: No credential received");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await loginWithGoogle(
      credentialResponse.credential,
      joinKumaranFamily
    );
    if (!result.success) {
      setError(result.error || "Google login failed");
    } else if (result.data) {
      // Restore cart and wishlist from Supabase if available
      if (result.data.savedCartId) {
        restoreCartFromCloud(result.data.savedCartId);
      }
      if (
        result.data.savedWishlistProductIds &&
        result.data.savedWishlistProductIds.length > 0
      ) {
        restoreWishlistFromCloud(result.data.savedWishlistProductIds);
      }

      // Associate user email with Shopify cart for checkout
      // This ensures the user's email is pre-filled at Shopify checkout
      if (result.data.email) {
        associateBuyerIdentity(result.data.email);
      }
    }

    setIsSubmitting(false);
  };

  // Handle Google OAuth error
  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", firstName: "", lastName: "" });
    setError("");
    setSuccess("");
  };

  if (!isOpen) return null;

  // If authenticated, show account view (support both email and Google auth)
  const showAccount = isAuthenticated && (customer || googleCustomer);

  // Get display name from either customer type
  const displayName =
    customer?.firstName || googleCustomer?.name?.split(" ")[0] || "there";
  const displayEmail = customer?.email || googleCustomer?.email || "";
  const displayPhone = customer?.phone;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0d1f14] border-l border-[#2a4a35] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a4a35]">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#b8860b]" />
            <h2 className="text-xl font-serif font-bold text-[#f5f0e1]">
              {showAccount
                ? `Hi, ${displayName}!`
                : mode === "login"
                ? "Sign In"
                : mode === "register"
                ? "Create Account"
                : "Reset Password"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1a472a] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#f5f0e1]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-[#b8860b] animate-spin" />
            </div>
          ) : showAccount ? (
            /* Account View */
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="p-4 bg-[#1a472a]/30 rounded-xl border border-[#2a4a35]">
                {/* Profile section - always show for Google auth */}
                {authMethod === "google" && googleCustomer && (
                  <div className="flex items-center gap-3 mb-3">
                    {googleCustomer.picture ? (
                      <img
                        src={googleCustomer.picture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-[#b8860b]/50"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-[#b8860b]/50 bg-[#b8860b]/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-[#b8860b]" />
                      </div>
                    )}
                    <div>
                      <p className="text-[#f5f0e1] font-medium text-lg">
                        {googleCustomer.name || displayName}
                      </p>
                      <span className="text-xs text-[#b8860b]">
                        Signed in with Google
                      </span>
                    </div>
                  </div>
                )}
                {/* Show name for email auth */}
                {authMethod === "email" && customer && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full border-2 border-[#b8860b]/50 bg-[#b8860b]/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-[#b8860b]" />
                    </div>
                    <div>
                      <p className="text-[#f5f0e1] font-medium text-lg">
                        {customer.firstName} {customer.lastName}
                      </p>
                    </div>
                  </div>
                )}
                <p className="text-[#f5f0e1]/80">{displayEmail}</p>
                {displayPhone && (
                  <p className="text-[#f5f0e1]/60 text-sm mt-1">
                    {displayPhone}
                  </p>
                )}
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                {/* My Account Page Link */}
                <Link
                  href="/account"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#b8860b]/20 to-[#d4a017]/10 rounded-xl border border-[#b8860b]/30 hover:border-[#b8860b]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-[#b8860b]" />
                    <span className="text-[#f5f0e1] font-semibold">
                      My Account
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#b8860b]" />
                </Link>

                <button
                  onClick={() => {
                    onClose();
                    onOpenWishlist();
                  }}
                  className="w-full flex items-center justify-between p-4 bg-[#1a472a]/20 rounded-xl border border-[#2a4a35]/50 hover:border-[#b8860b]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-[#b8860b]" />
                    <span className="text-[#f5f0e1]">My Wishlist</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#f5f0e1]/50" />
                </button>

                {/* Orders - Show only for email auth with Storefront API data */}
                {customer && customer.orders.edges.length > 0 && (
                  <div className="p-4 bg-[#1a472a]/20 rounded-xl border border-[#2a4a35]/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-5 h-5 text-[#b8860b]" />
                      <span className="text-[#f5f0e1] font-semibold">
                        Recent Orders
                      </span>
                    </div>
                    <div className="space-y-2">
                      {customer.orders.edges
                        .slice(0, 3)
                        .map(({ node: order }) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between text-sm p-2 bg-[#0d1f14]/50 rounded-lg"
                          >
                            <div>
                              <p className="text-[#f5f0e1]">
                                Order #{order.orderNumber}
                              </p>
                              <p className="text-[#f5f0e1]/50 text-xs">
                                {new Date(
                                  order.processedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[#b8860b] font-semibold">
                                ₹
                                {parseFloat(order.totalPrice.amount).toFixed(0)}
                              </p>
                              <p className="text-[#f5f0e1]/50 text-xs capitalize">
                                {order.fulfillmentStatus
                                  .toLowerCase()
                                  .replace("_", " ")}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Default Address - Show only for email auth */}
                {customer && customer.defaultAddress && (
                  <div className="p-4 bg-[#1a472a]/20 rounded-xl border border-[#2a4a35]/50">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-[#b8860b]" />
                      <span className="text-[#f5f0e1] font-semibold">
                        Default Address
                      </span>
                    </div>
                    <p className="text-[#f5f0e1]/70 text-sm">
                      {customer.defaultAddress.address1}
                      {customer.defaultAddress.address2 &&
                        `, ${customer.defaultAddress.address2}`}
                      <br />
                      {customer.defaultAddress.city},{" "}
                      {customer.defaultAddress.province}{" "}
                      {customer.defaultAddress.zip}
                      <br />
                      {customer.defaultAddress.country}
                    </p>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>

              {/* Manage Account on Shopify - Only for email auth users */}
              {authMethod === "email" && (
                <a
                  href={SHOPIFY_ACCOUNT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 border border-[#2a4a35] hover:border-[#b8860b]/50 text-[#f5f0e1]/70 hover:text-[#f5f0e1] font-medium rounded-full transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Manage Account
                </a>
              )}
            </div>
          ) : (
            /* Auth Forms */
            <div className="space-y-6">
              {/* Google Sign-In Button - Primary CTA */}
              {(mode === "login" || mode === "register") && (
                <div className="space-y-4">
                  {/* Enhanced Kumaran Family Section */}
                  <div className="p-5 bg-gradient-to-br from-[#b8860b]/20 via-[#d4a017]/15 to-[#b8860b]/10 rounded-2xl border border-[#b8860b]/40 mb-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4a017] flex items-center justify-center shadow-lg">
                        <Crown className="w-5 h-5 text-[#0d1f14]" />
                      </div>
                      <div>
                        <h3 className="text-[#f5f0e1] font-bold text-lg">
                          Join the Kumaran Family
                        </h3>
                        <p className="text-[#b8860b] text-xs font-medium">
                          Unlock exclusive benefits
                        </p>
                      </div>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-2 mb-4">
                      {[
                        { icon: Percent, text: "5% OFF on every order, forever" },
                        { icon: Sparkles, text: "Early access to new products" },
                        { icon: Gift, text: "Exclusive recipes & cooking tips" },
                        { icon: Crown, text: "Member-only offers & giveaways" },
                      ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#b8860b]/20 flex items-center justify-center flex-shrink-0">
                            <benefit.icon className="w-3 h-3 text-[#b8860b]" />
                          </div>
                          <span className="text-[#f5f0e1]/90 text-sm">
                            {benefit.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#0d1f14]/40 rounded-xl border border-[#b8860b]/30 hover:border-[#b8860b]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={joinKumaranFamily}
                        onChange={(e) => setJoinKumaranFamily(e.target.checked)}
                        className="w-5 h-5 rounded border-[#b8860b] bg-[#1a472a]/50 text-[#b8860b] focus:ring-[#b8860b] focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <span className="text-[#f5f0e1] font-semibold text-sm">
                          Yes, I want these benefits!
                        </span>
                        <span className="ml-2 text-xs text-[#b8860b] font-bold bg-[#b8860b]/20 px-2 py-0.5 rounded-full">
                          FREE
                        </span>
                      </div>
                      {joinKumaranFamily && (
                        <Check className="w-5 h-5 text-green-400" />
                      )}
                    </label>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-[#b8860b]/20">
                      <Users className="w-4 h-4 text-[#b8860b]/70" />
                      <span className="text-[#f5f0e1]/60 text-xs">
                        10,000+ families already joined
                      </span>
                    </div>
                  </div>

                  {/* Actual Google OAuth Login */}
                  <div className="flex justify-center">
                    {isSubmitting ? (
                      <div className="w-full flex items-center justify-center gap-3 py-4 bg-white text-gray-800 font-semibold rounded-full border border-gray-200 shadow-sm">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="pill"
                        width="350"
                      />
                    )}
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#2a4a35]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#0d1f14] text-[#f5f0e1]/50">
                        or continue with email
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {success}
                </div>
              )}

              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[#f5f0e1]/70 text-sm mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f5f0e1]/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#1a472a]/30 border border-[#2a4a35] rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#f5f0e1]/70 text-sm mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f5f0e1]/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 bg-[#1a472a]/30 border border-[#2a4a35] rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f5f0e1]/40 hover:text-[#f5f0e1]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#b8860b] hover:bg-[#d4a017] disabled:opacity-50 text-[#0d1f14] font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot-password");
                      resetForm();
                    }}
                    className="w-full text-[#f5f0e1]/50 hover:text-[#b8860b] text-sm transition-colors"
                  >
                    Forgot your password?
                  </button>
                </form>
              )}

              {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#f5f0e1]/70 text-sm mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#2a4a35] rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-[#f5f0e1]/70 text-sm mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1a472a]/30 border border-[#2a4a35] rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#f5f0e1]/70 text-sm mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f5f0e1]/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#1a472a]/30 border border-[#2a4a35] rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#f5f0e1]/70 text-sm mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f5f0e1]/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={5}
                        className="w-full pl-10 pr-12 py-3 bg-[#1a472a]/30 border border-[#2a4a35] rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="Min. 5 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f5f0e1]/40 hover:text-[#f5f0e1]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Join Kumaran Family Checkbox (compact version for email form) */}
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-gradient-to-r from-[#b8860b]/15 to-[#d4a017]/10 rounded-xl border border-[#b8860b]/30 hover:border-[#b8860b]/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={joinKumaranFamily}
                      onChange={(e) => setJoinKumaranFamily(e.target.checked)}
                      className="w-5 h-5 rounded border-[#b8860b] bg-[#1a472a]/50 text-[#b8860b] focus:ring-[#b8860b] focus:ring-offset-0"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-[#b8860b]" />
                      <span className="text-[#f5f0e1] font-semibold text-sm">
                        Join Kumaran Family
                      </span>
                      <span className="text-xs text-[#b8860b] font-bold bg-[#b8860b]/20 px-2 py-0.5 rounded-full">
                        5% OFF
                      </span>
                    </div>
                    {joinKumaranFamily && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#b8860b] hover:bg-[#d4a017] disabled:opacity-50 text-[#0d1f14] font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              )}

              {mode === "forgot-password" && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-[#f5f0e1]/70 text-sm">
                    Enter your email address and we&apos;ll send you a link to
                    reset your password.
                  </p>
                  <div>
                    <label className="block text-[#f5f0e1]/70 text-sm mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f5f0e1]/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#1a472a]/30 border border-[#2a4a35] rounded-xl text-[#f5f0e1] placeholder:text-[#f5f0e1]/30 focus:border-[#b8860b] focus:outline-none transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#b8860b] hover:bg-[#d4a017] disabled:opacity-50 text-[#0d1f14] font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      resetForm();
                    }}
                    className="w-full text-[#f5f0e1]/50 hover:text-[#b8860b] text-sm transition-colors"
                  >
                    Back to Sign In
                  </button>
                </form>
              )}

              {/* Toggle between login/register */}
              {(mode === "login" || mode === "register") && (
                <div className="pt-4 border-t border-[#2a4a35]">
                  <p className="text-center text-[#f5f0e1]/60 text-sm">
                    {mode === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button
                      onClick={() => {
                        setMode(mode === "login" ? "register" : "login");
                        resetForm();
                      }}
                      className="ml-2 text-[#b8860b] hover:text-[#d4a017] font-semibold transition-colors"
                    >
                      {mode === "login" ? "Create one" : "Sign in"}
                    </button>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
