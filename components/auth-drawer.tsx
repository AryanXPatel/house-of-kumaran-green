"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWishlist: () => void;
}

type AuthMode = "login" | "register" | "forgot-password" | "account";

export function AuthDrawer({
  isOpen,
  onClose,
  onOpenWishlist,
}: AuthDrawerProps) {
  const {
    customer,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    recoverPassword,
  } = useAuth();
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

    const result = await register(formData);
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

  const resetForm = () => {
    setFormData({ email: "", password: "", firstName: "", lastName: "" });
    setError("");
    setSuccess("");
  };

  if (!isOpen) return null;

  // If authenticated, show account view
  const showAccount = isAuthenticated && customer;

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
                ? `Hi, ${customer.firstName || "there"}!`
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
                <p className="text-[#f5f0e1]">{customer.email}</p>
                {customer.phone && (
                  <p className="text-[#f5f0e1]/60 text-sm mt-1">
                    {customer.phone}
                  </p>
                )}
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
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

                {/* Orders - Link to Shopify */}
                {customer.orders.edges.length > 0 && (
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

                {/* Default Address */}
                {customer.defaultAddress && (
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
            </div>
          ) : (
            /* Auth Forms */
            <div className="space-y-6">
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
