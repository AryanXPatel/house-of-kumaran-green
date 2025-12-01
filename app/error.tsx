"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0d1f14] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* Error Message */}
        <h1 className="font-serif text-3xl font-bold text-[#f5f0e1] mb-4">
          Something went wrong
        </h1>
        <p className="text-[#f5f0e1]/70 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or return to the homepage.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
            <p className="text-sm font-mono text-red-400 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-400/60 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#b8860b]/50 text-[#b8860b] hover:bg-[#b8860b]/10 font-semibold rounded-full transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-[#f5f0e1]/50">
          Need help?{" "}
          <Link href="/contact" className="text-[#b8860b] hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
