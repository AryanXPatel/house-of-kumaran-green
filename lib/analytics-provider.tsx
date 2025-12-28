"use client";

/**
 * Analytics Provider
 * Automatically tracks page views on navigation
 * 
 * IMPORTANT: This provider is designed to be non-blocking and fail-silently
 */

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "./analytics";

interface AnalyticsProviderProps {
    children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lastTrackedPath = useRef<string>("");

    useEffect(() => {
        // Build full path with query params
        const fullPath = searchParams?.toString()
            ? `${pathname}?${searchParams.toString()}`
            : pathname;

        // Only track if path changed (prevents double tracking)
        if (fullPath !== lastTrackedPath.current) {
            lastTrackedPath.current = fullPath;

            // Small delay to ensure page title is updated
            setTimeout(() => {
                try {
                    trackPageView();
                } catch {
                    // Silently fail - never break navigation
                }
            }, 100);
        }
    }, [pathname, searchParams]);

    return <>{children}</>;
}
