"use client";

/**
 * Analytics Provider Wrapper
 * Wraps the AnalyticsProvider in a Suspense boundary for useSearchParams
 * 
 * IMPORTANT: This component is designed to be non-blocking and fail-silently
 */

import { Suspense } from "react";
import { AnalyticsProvider } from "./analytics-provider";

interface AnalyticsProviderWrapperProps {
    children: React.ReactNode;
}

export function AnalyticsProviderWrapper({ children }: AnalyticsProviderWrapperProps) {
    return (
        <Suspense fallback={null}>
            <AnalyticsProvider>{children}</AnalyticsProvider>
        </Suspense>
    );
}
