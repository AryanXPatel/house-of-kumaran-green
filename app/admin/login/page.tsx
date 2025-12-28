"use client";

/**
 * Admin Login Page
 * Secure login page for analytics dashboard access
 * 
 * Route: /admin/login
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
    const [retryAfter, setRetryAfter] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Successful login - redirect to analytics
                router.push("/admin/analytics");
                router.refresh();
            } else if (response.status === 429) {
                // Rate limited
                setRetryAfter(data.retryAfter);
                setError(`Too many attempts. Try again in ${Math.ceil(data.retryAfter / 60)} minutes.`);
            } else if (response.status === 401) {
                // Invalid password
                setRemainingAttempts(data.remainingAttempts);
                setError(
                    data.remainingAttempts > 0
                        ? `Invalid password. ${data.remainingAttempts} attempts remaining.`
                        : "Invalid password. Account temporarily locked."
                );
            } else {
                setError(data.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1f14] flex items-center justify-center p-4">
            {/* Grain overlay */}
            <div className="grain-overlay" />

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b8860b]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2a4a35]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#b8860b]/10 border border-[#b8860b]/20 mb-4">
                        <Lock className="w-8 h-8 text-[#b8860b]" />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-[#f5f0e1]">
                        Admin Dashboard
                    </h1>
                    <p className="text-[#a0a0a0] mt-2">
                        House of Kumaran Analytics
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#132a1c] border border-[#2a4a35] rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* Password Input */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[#f5f0e1] mb-2"
                            >
                                Admin Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="w-full px-4 py-3 pr-12 rounded-lg bg-[#0d1f14] border border-[#2a4a35] text-[#f5f0e1] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b] transition-colors"
                                    disabled={isLoading || retryAfter !== null}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-[#f5f0e1] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !password || retryAfter !== null}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#b8860b] text-[#0d1f14] font-bold transition-all hover:bg-[#d4a017] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Info */}
                    <div className="mt-6 pt-6 border-t border-[#2a4a35]">
                        <p className="text-xs text-[#a0a0a0] text-center">
                            This is a secure admin area. All login attempts are monitored.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#a0a0a0]/50 mt-6">
                    © {new Date().getFullYear()} House of Kumaran
                </p>
            </div>
        </div>
    );
}
