/**
 * Analytics Events API Endpoint
 * Records website analytics events from the frontend
 * 
 * POST /api/analytics/events
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Use service role for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client only if credentials are available
function getSupabaseClient() {
    if (!supabaseUrl || !supabaseServiceKey) {
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabaseClient();

        if (!supabase) {
            // Silently fail if Supabase is not configured
            console.log("[Analytics API] Supabase not configured, skipping");
            return NextResponse.json({ success: true });
        }

        const body = await request.json();

        // DEBUG: Log incoming event
        console.log("[Analytics API] Received event:", body.event_type, body.page_path);

        const {
            session_id,
            visitor_id,
            event_type,
            page_url,
            page_path,
            page_title,
            event_data,
            device_type,
            browser,
            os,
            screen_width,
            screen_height,
            referrer,
            utm_source,
            utm_medium,
            utm_campaign,
        } = body;

        if (!session_id || !event_type) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Upsert session info
        const { error: sessionError } = await supabase
            .from("analytics_sessions")
            .upsert(
                {
                    session_id,
                    visitor_id,
                    device_type,
                    browser,
                    os,
                    screen_width,
                    screen_height,
                    referrer,
                    utm_source,
                    utm_medium,
                    utm_campaign,
                    page_views: event_type === "page_view" ? 1 : 0,
                    bounce: event_type === "page_view" ? true : false,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "session_id",
                    ignoreDuplicates: false,
                }
            );

        if (sessionError) {
            console.error("Session upsert error:", sessionError);
        }

        // If this is a page view, increment page_views and update bounce status
        if (event_type === "page_view") {
            await supabase.rpc("increment_page_views", { sid: session_id });
        }

        // Insert the event
        const { error: eventError } = await supabase.from("analytics_events").insert({
            session_id,
            event_type,
            page_url,
            page_path,
            page_title,
            event_data: event_data || {},
        });

        if (eventError) {
            console.error("Event insert error:", eventError);
        }

        // Update top pages for page views
        if (event_type === "page_view" && page_path) {
            const today = new Date().toISOString().split("T")[0];

            const { error: topPagesError } = await supabase.rpc("upsert_top_page", {
                p_date: today,
                p_page_path: page_path,
                p_page_title: page_title || page_path,
            });

            if (topPagesError) {
                console.error("Top pages upsert error:", topPagesError);
            }
        }

        // Update top products for product views
        if (event_type === "product_view" && event_data?.product_id) {
            const today = new Date().toISOString().split("T")[0];

            const { error: topProductsError } = await supabase.rpc("upsert_top_product", {
                p_date: today,
                p_product_id: event_data.product_id as string,
                p_product_title: (event_data.product_title as string) || "",
                p_is_cart: false,
            });

            if (topProductsError) {
                console.error("Top products upsert error:", topProductsError);
            }
        }

        // Update top products for add to cart
        if (event_type === "add_to_cart" && event_data?.product_id) {
            const today = new Date().toISOString().split("T")[0];

            const { error: topProductsError } = await supabase.rpc("upsert_top_product", {
                p_date: today,
                p_product_id: event_data.product_id as string,
                p_product_title: (event_data.product_title as string) || "",
                p_is_cart: true,
            });

            if (topProductsError) {
                console.error("Top products add_to_cart upsert error:", topProductsError);
            }
        }

        // Track search queries
        if (event_type === "search" && event_data?.query) {
            const { error: searchError } = await supabase.from("analytics_searches").insert({
                session_id,
                query: event_data.query,
                result_count: event_data.result_count || 0,
            });

            if (searchError) {
                console.error("Search insert error:", searchError);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics event error:", error);
        // Always return success to not break the frontend
        return NextResponse.json({ success: true });
    }
}
