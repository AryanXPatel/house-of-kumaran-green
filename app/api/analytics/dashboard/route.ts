/**
 * Analytics Dashboard API Endpoint
 * Returns aggregated analytics data for the dashboard
 * 
 * GET /api/analytics/dashboard?start=YYYY-MM-DD&end=YYYY-MM-DD
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Use service role for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseClient() {
    if (!supabaseUrl || !supabaseServiceKey) {
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceKey);
}

export interface DashboardData {
    overview: {
        totalVisitors: number;
        totalPageViews: number;
        bounceRate: number;
        avgSessionDuration: number;
        totalProductViews: number;
        totalAddToCarts: number;
        totalCheckouts: number;
        totalSearches: number;
        totalWishlistAdds: number;
    };
    previousPeriod: {
        totalVisitors: number;
        totalPageViews: number;
        bounceRate: number;
        totalProductViews: number;
        totalAddToCarts: number;
        totalCheckouts: number;
        totalSearches: number;
        totalWishlistAdds: number;
    };
    trafficTrend: Array<{
        date: string;
        visitors: number;
        pageViews: number;
    }>;
    topPages: Array<{
        pagePath: string;
        pageTitle: string;
        views: number;
        uniqueVisitors: number;
    }>;
    topProducts: Array<{
        productId: string;
        productTitle: string;
        views: number;
        addToCartCount: number;
    }>;
    deviceBreakdown: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
    browserBreakdown: Array<{
        browser: string;
        count: number;
    }>;
    topSearches: Array<{
        query: string;
        count: number;
        avgResults: number;
    }>;
    topWishlisted: Array<{
        productId: string;
        productTitle: string;
        count: number;
    }>;
    recentEvents: Array<{
        eventType: string;
        pagePath: string;
        createdAt: string;
        eventData: Record<string, unknown>;
    }>;
}

export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabaseClient();

        if (!supabase) {
            return NextResponse.json(
                { error: "Analytics not configured" },
                { status: 503 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get("start") || getDefaultStartDate();
        const endDate = searchParams.get("end") || getDefaultEndDate();

        // Calculate previous period dates (same duration, before start date)
        const startMs = new Date(startDate).getTime();
        const endMs = new Date(endDate).getTime();
        const periodDuration = endMs - startMs;
        const prevEndDate = new Date(startMs - 1).toISOString().split("T")[0];
        const prevStartDate = new Date(startMs - periodDuration - 1).toISOString().split("T")[0];

        // Fetch all data in parallel - query real-time from events/sessions tables
        const [
            sessionsData,
            allEvents,
            prevSessionsData,
            prevEventsData,
            topPages,
            topProducts,
            searches,
            wishlistEvents,
            recentEvents,
        ] = await Promise.all([
            // Current period sessions
            supabase
                .from("analytics_sessions")
                .select("session_id, visitor_id, device_type, browser, page_views, bounce, started_at")
                .gte("started_at", `${startDate}T00:00:00`)
                .lte("started_at", `${endDate}T23:59:59`),

            // Current period events
            supabase
                .from("analytics_events")
                .select("event_type, created_at")
                .gte("created_at", `${startDate}T00:00:00`)
                .lte("created_at", `${endDate}T23:59:59`),

            // Previous period sessions (for comparison)
            supabase
                .from("analytics_sessions")
                .select("session_id, visitor_id, page_views, bounce")
                .gte("started_at", `${prevStartDate}T00:00:00`)
                .lte("started_at", `${prevEndDate}T23:59:59`),

            // Previous period events (for comparison)
            supabase
                .from("analytics_events")
                .select("event_type")
                .gte("created_at", `${prevStartDate}T00:00:00`)
                .lte("created_at", `${prevEndDate}T23:59:59`),

            // Top pages
            supabase
                .from("analytics_top_pages")
                .select("*")
                .gte("date", startDate)
                .lte("date", endDate)
                .order("views", { ascending: false })
                .limit(10),

            // Top products
            supabase
                .from("analytics_top_products")
                .select("*")
                .gte("date", startDate)
                .lte("date", endDate)
                .order("views", { ascending: false })
                .limit(10),

            // Top searches
            supabase
                .from("analytics_searches")
                .select("query, result_count")
                .gte("created_at", `${startDate}T00:00:00`)
                .lte("created_at", `${endDate}T23:59:59`),

            // Wishlist events (for top wishlisted products)
            supabase
                .from("analytics_events")
                .select("event_data")
                .eq("event_type", "wishlist_add")
                .gte("created_at", `${startDate}T00:00:00`)
                .lte("created_at", `${endDate}T23:59:59`),

            // Recent events
            supabase
                .from("analytics_events")
                .select("event_type, page_path, created_at, event_data")
                .order("created_at", { ascending: false })
                .limit(20),
        ]);

        // Calculate real-time overview metrics from sessions and events
        const sessions = sessionsData.data || [];
        const events = allEvents.data || [];
        const overview = calculateRealTimeOverview(sessions, events);

        // Calculate previous period metrics for comparison
        const prevSessions = prevSessionsData.data || [];
        const prevEvents = prevEventsData.data || [];
        const previousPeriod = calculatePreviousPeriodMetrics(prevSessions, prevEvents);

        // Build traffic trend from sessions (grouped by date)
        const trafficTrend = buildTrafficTrend(sessions, startDate, endDate);

        // Aggregate top pages across days
        const aggregatedTopPages = aggregateTopPages(topPages.data || []);

        // Aggregate top products across days
        const aggregatedTopProducts = aggregateTopProducts(topProducts.data || []);

        // Calculate device breakdown
        const deviceBreakdown = calculateDeviceBreakdown(sessions);

        // Calculate browser breakdown
        const browserBreakdown = calculateBrowserBreakdown(sessions);

        // Calculate top searches
        const topSearches = calculateTopSearches(searches.data || []);

        // Calculate top wishlisted products
        const topWishlisted = calculateTopWishlisted(wishlistEvents.data || []);

        // Format recent events
        const formattedRecentEvents = (recentEvents.data || []).map((event) => ({
            eventType: event.event_type,
            pagePath: event.page_path,
            createdAt: event.created_at,
            eventData: event.event_data || {},
        }));

        const dashboardData: DashboardData = {
            overview,
            previousPeriod,
            trafficTrend,
            topPages: aggregatedTopPages,
            topProducts: aggregatedTopProducts,
            deviceBreakdown,
            browserBreakdown,
            topSearches,
            topWishlisted,
            recentEvents: formattedRecentEvents,
        };

        return NextResponse.json(dashboardData);
    } catch (error) {
        console.error("Dashboard data error:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics data" },
            { status: 500 }
        );
    }
}


// Helper functions

function getDefaultStartDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
}

function getDefaultEndDate(): string {
    return new Date().toISOString().split("T")[0];
}

// Interface for session rows from database
interface SessionRow {
    session_id: string;
    visitor_id: string;
    device_type: string;
    browser: string;
    page_views: number;
    bounce: boolean;
    started_at: string;
}

// Interface for event rows from database
interface EventRow {
    event_type: string;
    created_at: string;
}

/**
 * Calculate overview metrics from real-time sessions and events data
 */
function calculateRealTimeOverview(
    sessions: SessionRow[],
    events: EventRow[]
): DashboardData["overview"] {
    // Count unique visitors
    const uniqueVisitorIds = new Set(sessions.map(s => s.visitor_id));
    const totalVisitors = uniqueVisitorIds.size;

    // Sum page views from sessions
    const totalPageViews = sessions.reduce((sum, s) => sum + (s.page_views || 0), 0);

    // Count bounces
    const bounceCount = sessions.filter(s => s.bounce === true).length;
    const bounceRate = sessions.length > 0
        ? Math.round((bounceCount / sessions.length) * 100)
        : 0;

    // Count events by type
    const eventCounts = events.reduce((acc, e) => {
        acc[e.event_type] = (acc[e.event_type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        totalVisitors,
        totalPageViews,
        bounceRate,
        avgSessionDuration: 0, // Would need session duration tracking
        totalProductViews: eventCounts["product_view"] || 0,
        totalAddToCarts: eventCounts["add_to_cart"] || 0,
        totalCheckouts: eventCounts["checkout_initiated"] || 0,
        totalSearches: eventCounts["search"] || 0,
        totalWishlistAdds: eventCounts["wishlist_add"] || 0,
    };
}

// Simplified session row for previous period (no device/browser needed)
interface PrevSessionRow {
    session_id: string;
    visitor_id: string;
    page_views: number;
    bounce: boolean;
}

// Simplified event row for previous period
interface PrevEventRow {
    event_type: string;
}

/**
 * Calculate previous period metrics for comparison
 */
function calculatePreviousPeriodMetrics(
    sessions: PrevSessionRow[],
    events: PrevEventRow[]
): DashboardData["previousPeriod"] {
    // Count unique visitors
    const uniqueVisitorIds = new Set(sessions.map(s => s.visitor_id));
    const totalVisitors = uniqueVisitorIds.size;

    // Sum page views from sessions
    const totalPageViews = sessions.reduce((sum, s) => sum + (s.page_views || 0), 0);

    // Count bounces
    const bounceCount = sessions.filter(s => s.bounce === true).length;
    const bounceRate = sessions.length > 0
        ? Math.round((bounceCount / sessions.length) * 100)
        : 0;

    // Count events by type
    const eventCounts = events.reduce((acc, e) => {
        acc[e.event_type] = (acc[e.event_type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        totalVisitors,
        totalPageViews,
        bounceRate,
        totalProductViews: eventCounts["product_view"] || 0,
        totalAddToCarts: eventCounts["add_to_cart"] || 0,
        totalCheckouts: eventCounts["checkout_initiated"] || 0,
        totalSearches: eventCounts["search"] || 0,
        totalWishlistAdds: eventCounts["wishlist_add"] || 0,
    };
}


/**
 * Build traffic trend from sessions grouped by date
 */
function buildTrafficTrend(
    sessions: SessionRow[],
    startDate: string,
    endDate: string
): DashboardData["trafficTrend"] {
    // Group sessions by date
    const dateMap = new Map<string, { visitors: Set<string>; pageViews: number }>();

    for (const session of sessions) {
        const date = session.started_at.split("T")[0];
        if (!dateMap.has(date)) {
            dateMap.set(date, { visitors: new Set(), pageViews: 0 });
        }
        const entry = dateMap.get(date)!;
        entry.visitors.add(session.visitor_id);
        entry.pageViews += session.page_views || 0;
    }

    // Generate all dates in range
    const result: DashboardData["trafficTrend"] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        const data = dateMap.get(dateStr);
        result.push({
            date: dateStr,
            visitors: data?.visitors.size || 0,
            pageViews: data?.pageViews || 0,
        });
    }

    return result;
}


interface TopPageRow {
    page_path: string;
    page_title: string;
    views: number;
    unique_visitors: number;
}

function aggregateTopPages(
    pages: TopPageRow[]
): DashboardData["topPages"] {
    const pageMap = new Map<string, { pageTitle: string; views: number; uniqueVisitors: number }>();

    for (const page of pages) {
        const existing = pageMap.get(page.page_path);
        if (existing) {
            existing.views += page.views || 0;
            existing.uniqueVisitors += page.unique_visitors || 0;
        } else {
            pageMap.set(page.page_path, {
                pageTitle: page.page_title || page.page_path,
                views: page.views || 0,
                uniqueVisitors: page.unique_visitors || 0,
            });
        }
    }

    return Array.from(pageMap.entries())
        .map(([pagePath, data]) => ({
            pagePath,
            pageTitle: data.pageTitle,
            views: data.views,
            uniqueVisitors: data.uniqueVisitors,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
}

interface TopProductRow {
    product_id: string;
    product_title: string;
    views: number;
    add_to_cart_count: number;
}

function aggregateTopProducts(
    products: TopProductRow[]
): DashboardData["topProducts"] {
    const productMap = new Map<string, { productTitle: string; views: number; addToCartCount: number }>();

    for (const product of products) {
        const existing = productMap.get(product.product_id);
        if (existing) {
            existing.views += product.views || 0;
            existing.addToCartCount += product.add_to_cart_count || 0;
        } else {
            productMap.set(product.product_id, {
                productTitle: product.product_title || product.product_id,
                views: product.views || 0,
                addToCartCount: product.add_to_cart_count || 0,
            });
        }
    }

    return Array.from(productMap.entries())
        .map(([productId, data]) => ({
            productId,
            productTitle: data.productTitle,
            views: data.views,
            addToCartCount: data.addToCartCount,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
}

interface SessionRow {
    device_type: string;
    browser: string;
}

function calculateDeviceBreakdown(
    sessions: SessionRow[]
): DashboardData["deviceBreakdown"] {
    const breakdown = { mobile: 0, tablet: 0, desktop: 0 };

    for (const session of sessions) {
        const device = session.device_type as keyof typeof breakdown;
        if (device in breakdown) {
            breakdown[device]++;
        }
    }

    return breakdown;
}

function calculateBrowserBreakdown(
    sessions: SessionRow[]
): DashboardData["browserBreakdown"] {
    const browserMap = new Map<string, number>();

    for (const session of sessions) {
        const browser = session.browser || "Unknown";
        browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
    }

    return Array.from(browserMap.entries())
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

interface SearchRow {
    query: string;
    result_count: number;
}

function calculateTopSearches(
    searches: SearchRow[]
): DashboardData["topSearches"] {
    const searchMap = new Map<string, { count: number; totalResults: number }>();

    for (const search of searches) {
        const query = search.query?.toLowerCase().trim();
        if (!query) continue;

        const existing = searchMap.get(query);
        if (existing) {
            existing.count++;
            existing.totalResults += search.result_count || 0;
        } else {
            searchMap.set(query, {
                count: 1,
                totalResults: search.result_count || 0,
            });
        }
    }

    return Array.from(searchMap.entries())
        .map(([query, data]) => ({
            query,
            count: data.count,
            avgResults: Math.round(data.totalResults / data.count),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
}

interface WishlistEventRow {
    event_data: {
        product_id?: string;
        product_title?: string;
    };
}

/**
 * Calculate top wishlisted products from wishlist_add events
 */
function calculateTopWishlisted(
    events: WishlistEventRow[]
): DashboardData["topWishlisted"] {
    const productMap = new Map<string, { title: string; count: number }>();

    for (const event of events) {
        const productId = event.event_data?.product_id;
        const productTitle = event.event_data?.product_title || "Unknown Product";

        if (!productId) continue;

        const existing = productMap.get(productId);
        if (existing) {
            existing.count++;
        } else {
            productMap.set(productId, { title: productTitle, count: 1 });
        }
    }

    return Array.from(productMap.entries())
        .map(([productId, data]) => ({
            productId,
            productTitle: data.title,
            count: data.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
}
