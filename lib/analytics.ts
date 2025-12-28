/**
 * Analytics Tracking Library
 * Client-side tracking for website performance metrics
 * 
 * IMPORTANT: This library is designed to be non-blocking and fail-silently
 * to never interfere with the user experience or break existing functionality.
 */

// Types for analytics events
export type AnalyticsEventType =
    | "page_view"
    | "product_view"
    | "add_to_cart"
    | "checkout_initiated"
    | "search"
    | "wishlist_add"
    | "wishlist_remove";

export interface AnalyticsEvent {
    event_type: AnalyticsEventType;
    page_url?: string;
    page_path?: string;
    page_title?: string;
    event_data?: Record<string, unknown>;
}

export interface SessionInfo {
    session_id: string;
    visitor_id: string;
    device_type: "mobile" | "tablet" | "desktop";
    browser: string;
    os: string;
    screen_width: number;
    screen_height: number;
    referrer: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
}

// Storage keys
const VISITOR_ID_KEY = "hok_visitor_id";
const SESSION_ID_KEY = "hok_session_id";
const SESSION_START_KEY = "hok_session_start";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a unique ID
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create a persistent visitor ID
 */
function getVisitorId(): string {
    if (typeof window === "undefined") return "";

    try {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
            visitorId = `v_${generateId()}`;
            localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }
        return visitorId;
    } catch {
        return `v_${generateId()}`;
    }
}

/**
 * Get or create a session ID (expires after 30 min inactivity)
 */
function getSessionId(): string {
    if (typeof window === "undefined") return "";

    try {
        const now = Date.now();
        const sessionStart = localStorage.getItem(SESSION_START_KEY);
        let sessionId = localStorage.getItem(SESSION_ID_KEY);

        // Check if session expired
        if (sessionStart && now - parseInt(sessionStart) > SESSION_TIMEOUT) {
            sessionId = null;
        }

        if (!sessionId) {
            sessionId = `s_${generateId()}`;
            localStorage.setItem(SESSION_ID_KEY, sessionId);
        }

        // Always update session start time
        localStorage.setItem(SESSION_START_KEY, now.toString());

        return sessionId;
    } catch {
        return `s_${generateId()}`;
    }
}

/**
 * Detect device type from user agent
 */
function getDeviceType(): "mobile" | "tablet" | "desktop" {
    if (typeof window === "undefined") return "desktop";

    const ua = navigator.userAgent.toLowerCase();

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        return "mobile";
    }
    return "desktop";
}

/**
 * Get browser name from user agent
 */
function getBrowser(): string {
    if (typeof window === "undefined") return "unknown";

    const ua = navigator.userAgent;

    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";

    return "Other";
}

/**
 * Get OS from user agent
 */
function getOS(): string {
    if (typeof window === "undefined") return "unknown";

    const ua = navigator.userAgent;

    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";

    return "Other";
}

/**
 * Get UTM parameters from URL
 */
function getUTMParams(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
    if (typeof window === "undefined") return {};

    try {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get("utm_source") || undefined,
            utm_medium: params.get("utm_medium") || undefined,
            utm_campaign: params.get("utm_campaign") || undefined,
        };
    } catch {
        return {};
    }
}

/**
 * Get session info for the current visitor
 */
export function getSessionInfo(): SessionInfo {
    const utmParams = getUTMParams();

    return {
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        device_type: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        screen_width: typeof window !== "undefined" ? window.screen.width : 0,
        screen_height: typeof window !== "undefined" ? window.screen.height : 0,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        ...utmParams,
    };
}

/**
 * Send analytics event to the API
 * This function is designed to never throw or block
 */
async function sendEvent(event: AnalyticsEvent): Promise<void> {
    // Skip on server
    if (typeof window === "undefined") return;

    try {
        const sessionInfo = getSessionInfo();

        const payload = {
            ...event,
            session_id: sessionInfo.session_id,
            visitor_id: sessionInfo.visitor_id,
            device_type: sessionInfo.device_type,
            browser: sessionInfo.browser,
            os: sessionInfo.os,
            screen_width: sessionInfo.screen_width,
            screen_height: sessionInfo.screen_height,
            referrer: sessionInfo.referrer,
            utm_source: sessionInfo.utm_source,
            utm_medium: sessionInfo.utm_medium,
            utm_campaign: sessionInfo.utm_campaign,
            page_url: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
        };

        // DEBUG: Log event being sent
        console.log("[Analytics] Sending event:", event.event_type, payload.page_path);

        // Use fetch instead of sendBeacon for reliable delivery with Next.js
        fetch("/api/analytics/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
        })
            .then((res) => {
                console.log("[Analytics] Event sent, status:", res.status);
            })
            .catch((err) => {
                console.error("[Analytics] Fetch error:", err);
            });
    } catch (e) {
        console.error("[Analytics] Error sending event:", e);
        // Silently fail - analytics should never break the site
    }
}

// ============================================
// Public Tracking Functions
// ============================================

/**
 * Track a page view
 */
export function trackPageView(): void {
    sendEvent({
        event_type: "page_view",
    });
}

/**
 * Track a product view
 */
export function trackProductView(
    productId: string,
    productTitle?: string,
    productPrice?: number,
    productCategory?: string
): void {
    sendEvent({
        event_type: "product_view",
        event_data: {
            product_id: productId,
            product_title: productTitle,
            product_price: productPrice,
            product_category: productCategory,
        },
    });
}

/**
 * Track add to cart
 */
export function trackAddToCart(
    productId: string,
    productTitle?: string,
    quantity?: number,
    price?: number
): void {
    sendEvent({
        event_type: "add_to_cart",
        event_data: {
            product_id: productId,
            product_title: productTitle,
            quantity: quantity || 1,
            price: price,
        },
    });
}

/**
 * Track checkout initiated
 */
export function trackCheckoutInitiated(cartValue?: number, itemCount?: number): void {
    sendEvent({
        event_type: "checkout_initiated",
        event_data: {
            cart_value: cartValue,
            item_count: itemCount,
        },
    });
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultCount?: number): void {
    sendEvent({
        event_type: "search",
        event_data: {
            query: query,
            result_count: resultCount,
        },
    });
}

/**
 * Track wishlist addition
 */
export function trackWishlistAdd(productId: string, productTitle?: string): void {
    sendEvent({
        event_type: "wishlist_add",
        event_data: {
            product_id: productId,
            product_title: productTitle,
        },
    });
}

/**
 * Track wishlist removal
 */
export function trackWishlistRemove(productId: string): void {
    sendEvent({
        event_type: "wishlist_remove",
        event_data: {
            product_id: productId,
        },
    });
}
