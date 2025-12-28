"use client";

/**
 * Analytics Dashboard Page
 * Website performance metrics for business decisions
 * 
 * Route: /admin/analytics
 */

import { useEffect, useState, useCallback } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";
import {
    Users,
    Eye,
    MousePointerClick,
    ShoppingCart,
    Search,
    TrendingUp,
    TrendingDown,
    Smartphone,
    Tablet,
    Monitor,
    ArrowUpRight,
    Calendar,
    RefreshCw,
    Activity,
    Package,
    LogOut,
    Heart,
} from "lucide-react";
import type { DashboardData } from "@/app/api/analytics/dashboard/route";

// Date range options
const DATE_RANGES = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 14 Days", days: 14 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
];

// Chart colors matching the theme
const CHART_COLORS = {
    primary: "#b8860b",
    secondary: "#d4a017",
    green: "#2d5a3d",
    lightGreen: "#4a7c5a",
    accent: "#f5f0e1",
};

const DEVICE_COLORS = ["#b8860b", "#d4a017", "#4a7c5a"];

/**
 * Calculate percentage change between current and previous period
 * Returns a rounded integer percentage (e.g., 12 for 12% increase, -5 for 5% decrease)
 */
function calculateTrend(current: number, previous: number): number {
    if (previous === 0) {
        // If previous was 0 and current > 0, show 100% increase
        return current > 0 ? 100 : 0;
    }
    const change = ((current - previous) / previous) * 100;
    return Math.round(change);
}

export default function AnalyticsDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRange, setSelectedRange] = useState(30);
    const [refreshing, setRefreshing] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const endDate = new Date().toISOString().split("T")[0];
            const startDate = new Date(Date.now() - selectedRange * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0];

            const response = await fetch(
                `/api/analytics/dashboard?start=${startDate}&end=${endDate}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch analytics data");
            }

            const dashboardData = await response.json();
            setData(dashboardData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
        } catch {
            setLoggingOut(false);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={fetchData} />;
    }

    if (!data) {
        return <EmptyState />;
    }

    return (
        <div className="min-h-screen bg-[#0d1f14] text-[#f5f0e1]">
            {/* Grain overlay */}
            <div className="grain-overlay" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[#2a4a35] bg-[#0d1f14]/95 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="font-serif text-2xl font-bold text-[#f5f0e1] sm:text-3xl">
                                Analytics Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-[#a0a0a0]">
                                Website performance insights for House of Kumaran
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Date range selector */}
                            <div className="flex items-center gap-2 rounded-lg border border-[#2a4a35] bg-[#132a1c] p-1">
                                <Calendar className="ml-2 h-4 w-4 text-[#b8860b]" />
                                {DATE_RANGES.map((range) => (
                                    <button
                                        key={range.days}
                                        onClick={() => setSelectedRange(range.days)}
                                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${selectedRange === range.days
                                            ? "bg-[#b8860b] text-[#0d1f14]"
                                            : "text-[#a0a0a0] hover:text-[#f5f0e1]"
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>

                            {/* Refresh button */}
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center gap-2 rounded-lg border border-[#2a4a35] bg-[#132a1c] px-3 py-2 text-sm font-medium transition-all hover:border-[#b8860b] hover:text-[#b8860b] disabled:opacity-50"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                                />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>

                            {/* Logout button */}
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex items-center gap-2 rounded-lg border border-[#b54a35]/50 bg-[#132a1c] px-3 py-2 text-sm font-medium text-[#b54a35] transition-all hover:border-[#b54a35] hover:bg-[#b54a35]/10 disabled:opacity-50"
                            >
                                <LogOut className={`h-4 w-4 ${loggingOut ? "animate-pulse" : ""}`} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* KPI Cards */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <KPICard
                        title="Total Visitors"
                        value={data.overview.totalVisitors}
                        icon={Users}
                        trend={calculateTrend(data.overview.totalVisitors, data.previousPeriod.totalVisitors)}
                        color="gold"
                    />
                    <KPICard
                        title="Page Views"
                        value={data.overview.totalPageViews}
                        icon={Eye}
                        trend={calculateTrend(data.overview.totalPageViews, data.previousPeriod.totalPageViews)}
                        color="gold"
                    />
                    <KPICard
                        title="Bounce Rate"
                        value={`${data.overview.bounceRate}%`}
                        icon={MousePointerClick}
                        trend={calculateTrend(data.overview.bounceRate, data.previousPeriod.bounceRate)}
                        color="green"
                        invertTrend
                    />
                    <KPICard
                        title="Product Views"
                        value={data.overview.totalProductViews}
                        icon={Package}
                        trend={calculateTrend(data.overview.totalProductViews, data.previousPeriod.totalProductViews)}
                        color="gold"
                    />
                </div>

                {/* Secondary KPI Cards */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <KPICard
                        title="Add to Cart"
                        value={data.overview.totalAddToCarts}
                        icon={ShoppingCart}
                        trend={calculateTrend(data.overview.totalAddToCarts, data.previousPeriod.totalAddToCarts)}
                        color="green"
                        small
                    />
                    <KPICard
                        title="Checkouts"
                        value={data.overview.totalCheckouts}
                        icon={Activity}
                        trend={calculateTrend(data.overview.totalCheckouts, data.previousPeriod.totalCheckouts)}
                        color="green"
                        small
                    />
                    <KPICard
                        title="Searches"
                        value={data.overview.totalSearches}
                        icon={Search}
                        trend={calculateTrend(data.overview.totalSearches, data.previousPeriod.totalSearches)}
                        color="gold"
                        small
                    />
                    <KPICard
                        title="Wishlist Adds"
                        value={data.overview.totalWishlistAdds}
                        icon={Heart}
                        trend={calculateTrend(data.overview.totalWishlistAdds, data.previousPeriod.totalWishlistAdds)}
                        color="gold"
                        small
                    />
                    <KPICard
                        title="Conversion Rate"
                        value={`${data.overview.totalProductViews > 0
                            ? (
                                (data.overview.totalAddToCarts /
                                    data.overview.totalProductViews) *
                                100
                            ).toFixed(1)
                            : 0
                            }%`}
                        icon={TrendingUp}
                        color="gold"
                        small
                    />
                </div>


                {/* Charts Grid */}
                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                    {/* Traffic Trend */}
                    <div className="rounded-xl border border-[#2a4a35] bg-[#132a1c] p-6">
                        <h2 className="mb-4 font-serif text-lg font-semibold">
                            Traffic Trend
                        </h2>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.trafficTrend}>
                                    <defs>
                                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#b8860b" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d4a017" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a4a35" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#a0a0a0"
                                        fontSize={12}
                                        tickFormatter={(value) =>
                                            new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }
                                    />
                                    <YAxis stroke="#a0a0a0" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#132a1c",
                                            border: "1px solid #2a4a35",
                                            borderRadius: "8px",
                                            color: "#f5f0e1",
                                        }}
                                        labelFormatter={(value) =>
                                            new Date(value).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                month: "long",
                                                day: "numeric",
                                            })
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="visitors"
                                        stroke="#b8860b"
                                        fill="url(#colorVisitors)"
                                        strokeWidth={2}
                                        name="Visitors"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pageViews"
                                        stroke="#d4a017"
                                        fill="url(#colorPageViews)"
                                        strokeWidth={2}
                                        name="Page Views"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="rounded-xl border border-[#2a4a35] bg-[#132a1c] p-6">
                        <h2 className="mb-4 font-serif text-lg font-semibold">
                            Device Distribution
                        </h2>
                        <div className="flex h-[300px] items-center justify-between">
                            <div className="h-full w-1/2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: "Mobile", value: data.deviceBreakdown.mobile },
                                                { name: "Tablet", value: data.deviceBreakdown.tablet },
                                                { name: "Desktop", value: data.deviceBreakdown.desktop },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {DEVICE_COLORS.map((color, index) => (
                                                <Cell key={`cell-${index}`} fill={color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#132a1c",
                                                border: "1px solid #2a4a35",
                                                borderRadius: "8px",
                                                color: "#f5f0e1",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex w-1/2 flex-col gap-4 pl-4">
                                <DeviceLegendItem
                                    icon={Smartphone}
                                    label="Mobile"
                                    value={data.deviceBreakdown.mobile}
                                    total={
                                        data.deviceBreakdown.mobile +
                                        data.deviceBreakdown.tablet +
                                        data.deviceBreakdown.desktop
                                    }
                                    color="#b8860b"
                                />
                                <DeviceLegendItem
                                    icon={Tablet}
                                    label="Tablet"
                                    value={data.deviceBreakdown.tablet}
                                    total={
                                        data.deviceBreakdown.mobile +
                                        data.deviceBreakdown.tablet +
                                        data.deviceBreakdown.desktop
                                    }
                                    color="#d4a017"
                                />
                                <DeviceLegendItem
                                    icon={Monitor}
                                    label="Desktop"
                                    value={data.deviceBreakdown.desktop}
                                    total={
                                        data.deviceBreakdown.mobile +
                                        data.deviceBreakdown.tablet +
                                        data.deviceBreakdown.desktop
                                    }
                                    color="#4a7c5a"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                    {/* Top Pages */}
                    <div className="rounded-xl border border-[#2a4a35] bg-[#132a1c] p-6">
                        <h2 className="mb-4 font-serif text-lg font-semibold">Top Pages</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#2a4a35] text-left text-xs text-[#a0a0a0]">
                                        <th className="pb-3 font-medium">Page</th>
                                        <th className="pb-3 text-right font-medium">Views</th>
                                        <th className="pb-3 text-right font-medium">Visitors</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.topPages.length > 0 ? (
                                        data.topPages.map((page, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-[#2a4a35]/50 last:border-0"
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a4a35] text-xs font-medium text-[#b8860b]">
                                                            {index + 1}
                                                        </span>
                                                        <span className="truncate text-sm" title={page.pagePath}>
                                                            {page.pageTitle || page.pagePath}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right font-mono text-sm">
                                                    {page.views.toLocaleString()}
                                                </td>
                                                <td className="py-3 text-right font-mono text-sm text-[#a0a0a0]">
                                                    {page.uniqueVisitors.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-[#a0a0a0]">
                                                No page data yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="rounded-xl border border-[#2a4a35] bg-[#132a1c] p-6">
                        <h2 className="mb-4 font-serif text-lg font-semibold">
                            Top Products
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#2a4a35] text-left text-xs text-[#a0a0a0]">
                                        <th className="pb-3 font-medium">Product</th>
                                        <th className="pb-3 text-right font-medium">Views</th>
                                        <th className="pb-3 text-right font-medium">Cart</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.topProducts.length > 0 ? (
                                        data.topProducts.map((product, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-[#2a4a35]/50 last:border-0"
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a4a35] text-xs font-medium text-[#b8860b]">
                                                            {index + 1}
                                                        </span>
                                                        <span className="truncate text-sm" title={product.productTitle}>
                                                            {product.productTitle || product.productId}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right font-mono text-sm">
                                                    {product.views.toLocaleString()}
                                                </td>
                                                <td className="py-3 text-right font-mono text-sm text-[#4a7c5a]">
                                                    {product.addToCartCount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-[#a0a0a0]">
                                                No product data yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Wishlisted Products */}
                    <div className="rounded-xl border border-[#2a4a35] bg-[#132a1c] p-6 lg:col-span-2">
                        <h2 className="mb-4 font-serif text-lg font-semibold flex items-center gap-2">
                            <Heart className="h-5 w-5 text-[#e85a71]" />
                            Top Wishlisted Products
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#2a4a35] text-left text-xs text-[#a0a0a0]">
                                        <th className="pb-3 font-medium">Product</th>
                                        <th className="pb-3 text-right font-medium">Wishlist Adds</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.topWishlisted.length > 0 ? (
                                        data.topWishlisted.map((product, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-[#2a4a35]/50 last:border-0"
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e85a71]/20 text-xs font-medium text-[#e85a71]">
                                                            {index + 1}
                                                        </span>
                                                        <span className="truncate text-sm" title={product.productTitle}>
                                                            {product.productTitle || product.productId}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right font-mono text-sm text-[#e85a71]">
                                                    {product.count.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="py-8 text-center text-[#a0a0a0]">
                                                No wishlist data yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Searches */}
                    <div className="rounded-xl border border-[#2a4a35] bg-[#132a1c] p-6">
                        <h2 className="mb-4 font-serif text-lg font-semibold">
                            Popular Searches
                        </h2>
                        {data.topSearches.length > 0 ? (
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data.topSearches.slice(0, 8)}
                                        layout="vertical"
                                        margin={{ left: 80 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a4a35" />
                                        <XAxis type="number" stroke="#a0a0a0" fontSize={12} />
                                        <YAxis
                                            type="category"
                                            dataKey="query"
                                            stroke="#a0a0a0"
                                            fontSize={12}
                                            width={80}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#132a1c",
                                                border: "1px solid #2a4a35",
                                                borderRadius: "8px",
                                                color: "#f5f0e1",
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#b8860b" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex h-[250px] items-center justify-center text-[#a0a0a0]">
                                No search data yet
                            </div>
                        )}
                    </div>

                    {/* Browser Distribution */}
                    <div className="rounded-xl border border-[#2a4a35] bg-[#132a1c] p-6">
                        <h2 className="mb-4 font-serif text-lg font-semibold">
                            Browser Distribution
                        </h2>
                        {data.browserBreakdown.length > 0 ? (
                            <div className="space-y-4">
                                {data.browserBreakdown.map((browser, index) => {
                                    const total = data.browserBreakdown.reduce(
                                        (acc, b) => acc + b.count,
                                        0
                                    );
                                    const percentage = total > 0 ? (browser.count / total) * 100 : 0;

                                    return (
                                        <div key={index}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span>{browser.browser}</span>
                                                <span className="font-mono text-[#a0a0a0]">
                                                    {percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-[#2a4a35]">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#b8860b] to-[#d4a017] transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex h-[200px] items-center justify-center text-[#a0a0a0]">
                                No browser data yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Events */}
                <div className="mt-8 rounded-xl border border-[#2a4a35] bg-[#132a1c] p-6">
                    <h2 className="mb-4 font-serif text-lg font-semibold">
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {data.recentEvents.length > 0 ? (
                            data.recentEvents.slice(0, 10).map((event, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-lg bg-[#0d1f14] p-3"
                                >
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${event.eventType === "page_view"
                                            ? "bg-[#b8860b]/20 text-[#b8860b]"
                                            : event.eventType === "product_view"
                                                ? "bg-[#d4a017]/20 text-[#d4a017]"
                                                : event.eventType === "add_to_cart"
                                                    ? "bg-[#4a7c5a]/20 text-[#4a7c5a]"
                                                    : event.eventType === "wishlist_add" || event.eventType === "wishlist_remove"
                                                        ? "bg-[#e85a71]/20 text-[#e85a71]"
                                                        : "bg-[#2a4a35] text-[#a0a0a0]"
                                            }`}
                                    >
                                        {event.eventType === "page_view" ? (
                                            <Eye className="h-4 w-4" />
                                        ) : event.eventType === "product_view" ? (
                                            <Package className="h-4 w-4" />
                                        ) : event.eventType === "add_to_cart" ? (
                                            <ShoppingCart className="h-4 w-4" />
                                        ) : event.eventType === "search" ? (
                                            <Search className="h-4 w-4" />
                                        ) : event.eventType === "wishlist_add" || event.eventType === "wishlist_remove" ? (
                                            <Heart className="h-4 w-4" />
                                        ) : (
                                            <Activity className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm font-medium">
                                            {event.eventType.replace(/_/g, " ")}
                                        </span>
                                        <span className="ml-2 text-xs text-[#a0a0a0]">
                                            {event.pagePath}
                                        </span>
                                    </div>
                                    <span className="text-xs text-[#a0a0a0]">
                                        {new Date(event.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-[#a0a0a0]">
                                No recent activity yet
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// ============================================
// Sub-components
// ============================================

interface KPICardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: number;
    color: "gold" | "green";
    invertTrend?: boolean;
    small?: boolean;
}

function KPICard({
    title,
    value,
    icon: Icon,
    trend,
    color,
    invertTrend,
    small,
}: KPICardProps) {
    const isPositive = invertTrend ? (trend ?? 0) < 0 : (trend ?? 0) > 0;

    return (
        <div
            className={`group relative overflow-hidden rounded-xl border border-[#2a4a35] bg-[#132a1c] transition-all hover:border-[#b8860b]/50 ${small ? "p-4" : "p-6"
                }`}
        >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#b8860b]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#a0a0a0]">
                        {title}
                    </span>
                    <div
                        className={`rounded-lg p-2 ${color === "gold"
                            ? "bg-[#b8860b]/10 text-[#b8860b]"
                            : "bg-[#4a7c5a]/10 text-[#4a7c5a]"
                            }`}
                    >
                        <Icon className="h-4 w-4" />
                    </div>
                </div>

                <div
                    className={`font-mono font-bold ${small ? "text-xl" : "text-2xl sm:text-3xl"
                        }`}
                >
                    {typeof value === "number" ? value.toLocaleString() : value}
                </div>

                {trend !== undefined && (
                    <div className="mt-2 flex items-center gap-1">
                        {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-[#4a7c5a]" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-[#b54a35]" />
                        )}
                        <span
                            className={`text-xs font-medium ${isPositive ? "text-[#4a7c5a]" : "text-[#b54a35]"
                                }`}
                        >
                            {Math.abs(trend)}%
                        </span>
                        <span className="text-xs text-[#a0a0a0]">vs last period</span>
                    </div>
                )}
            </div>
        </div>
    );
}

interface DeviceLegendItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    total: number;
    color: string;
}

function DeviceLegendItem({
    icon: Icon,
    label,
    value,
    total,
    color,
}: DeviceLegendItemProps) {
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";

    // Determine color class based on color prop
    const getColorClass = () => {
        if (color === "#b8860b") return "text-[#b8860b]";
        if (color === "#d4a017") return "text-[#d4a017]";
        if (color === "#4a7c5a") return "text-[#4a7c5a]";
        return "text-[#b8860b]";
    };

    const getBgClass = () => {
        if (color === "#b8860b") return "bg-[#b8860b]/20";
        if (color === "#d4a017") return "bg-[#d4a017]/20";
        if (color === "#4a7c5a") return "bg-[#4a7c5a]/20";
        return "bg-[#b8860b]/20";
    };

    return (
        <div className="flex items-center gap-3">
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${getBgClass()}`}
            >
                <Icon className={`h-5 w-5 ${getColorClass()}`} />
            </div>
            <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-[#a0a0a0]">
                    {value.toLocaleString()} ({percentage}%)
                </div>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d1f14]">
            <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2a4a35] border-t-[#b8860b]" />
                <p className="text-[#a0a0a0]">Loading analytics...</p>
            </div>
        </div>
    );
}

function ErrorState({
    error,
    onRetry,
}: {
    error: string;
    onRetry: () => void;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d1f14]">
            <div className="text-center">
                <div className="mb-4 text-[#b54a35]">
                    <Activity className="mx-auto h-12 w-12" />
                </div>
                <h2 className="mb-2 font-serif text-xl font-bold text-[#f5f0e1]">
                    Failed to Load Analytics
                </h2>
                <p className="mb-4 text-[#a0a0a0]">{error}</p>
                <button
                    onClick={onRetry}
                    className="rounded-lg bg-[#b8860b] px-4 py-2 font-medium text-[#0d1f14] transition-colors hover:bg-[#d4a017]"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d1f14]">
            <div className="text-center">
                <div className="mb-4 text-[#b8860b]">
                    <Activity className="mx-auto h-12 w-12" />
                </div>
                <h2 className="mb-2 font-serif text-xl font-bold text-[#f5f0e1]">
                    No Analytics Data Yet
                </h2>
                <p className="text-[#a0a0a0]">
                    Start browsing the site to collect analytics data.
                </p>
            </div>
        </div>
    );
}
