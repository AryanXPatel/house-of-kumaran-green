-- Analytics Schema for House of Kumaran Website Performance Tracking
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Analytics Sessions Table
-- Tracks unique visitor sessions
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL UNIQUE,
    visitor_id TEXT NOT NULL, -- Persistent visitor identifier
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    page_views INTEGER DEFAULT 0,
    
    -- Device & Browser info
    device_type TEXT, -- mobile, tablet, desktop
    browser TEXT,
    os TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    
    -- Traffic source
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Location (from IP geolocation)
    country TEXT,
    city TEXT,
    
    -- Session metrics
    bounce BOOLEAN DEFAULT TRUE, -- True if only 1 page view
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. Analytics Events Table
-- Individual tracking events
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- page_view, product_view, add_to_cart, checkout_initiated, search
    
    -- Page context
    page_url TEXT,
    page_path TEXT,
    page_title TEXT,
    
    -- Event-specific data (JSONB for flexibility)
    event_data JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. Analytics Daily Stats Table
-- Pre-aggregated daily metrics for fast dashboard queries
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    
    -- Traffic metrics
    total_sessions INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_count INTEGER DEFAULT 0,
    
    -- Engagement metrics
    total_product_views INTEGER DEFAULT 0,
    total_add_to_cart INTEGER DEFAULT 0,
    total_checkout_initiated INTEGER DEFAULT 0,
    total_searches INTEGER DEFAULT 0,
    
    -- Device breakdown
    mobile_sessions INTEGER DEFAULT 0,
    tablet_sessions INTEGER DEFAULT 0,
    desktop_sessions INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. Top Pages Tracking (for quick access)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_top_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    page_path TEXT NOT NULL,
    page_title TEXT,
    views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(date, page_path)
);

-- ============================================
-- 5. Top Products Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_top_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    product_id TEXT NOT NULL,
    product_title TEXT,
    views INTEGER DEFAULT 0,
    add_to_cart_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(date, product_id)
);

-- ============================================
-- 6. Search Analytics
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    query TEXT NOT NULL,
    result_count INTEGER DEFAULT 0,
    clicked_product_id TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON analytics_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON analytics_sessions(visitor_id);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_type_created ON analytics_events(event_type, created_at);

-- Daily stats index
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON analytics_daily_stats(date);

-- Top pages/products indexes
CREATE INDEX IF NOT EXISTS idx_top_pages_date ON analytics_top_pages(date);
CREATE INDEX IF NOT EXISTS idx_top_products_date ON analytics_top_products(date);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_top_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_top_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_searches ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Service role has full access to sessions" ON analytics_sessions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to events" ON analytics_events
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to daily_stats" ON analytics_daily_stats
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to top_pages" ON analytics_top_pages
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to top_products" ON analytics_top_products
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to searches" ON analytics_searches
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Function to update daily stats (called by trigger or cron)
-- ============================================
CREATE OR REPLACE FUNCTION update_daily_stats(target_date DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO analytics_daily_stats (
        date,
        total_sessions,
        total_page_views,
        unique_visitors,
        bounce_count,
        total_product_views,
        total_add_to_cart,
        total_checkout_initiated,
        total_searches,
        mobile_sessions,
        tablet_sessions,
        desktop_sessions
    )
    SELECT
        target_date,
        COUNT(DISTINCT s.session_id),
        COALESCE(SUM(s.page_views), 0),
        COUNT(DISTINCT s.visitor_id),
        COUNT(CASE WHEN s.bounce THEN 1 END),
        (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'product_view' AND DATE(created_at) = target_date),
        (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'add_to_cart' AND DATE(created_at) = target_date),
        (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'checkout_initiated' AND DATE(created_at) = target_date),
        (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'search' AND DATE(created_at) = target_date),
        COUNT(CASE WHEN s.device_type = 'mobile' THEN 1 END),
        COUNT(CASE WHEN s.device_type = 'tablet' THEN 1 END),
        COUNT(CASE WHEN s.device_type = 'desktop' THEN 1 END)
    FROM analytics_sessions s
    WHERE DATE(s.started_at) = target_date
    ON CONFLICT (date) DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        total_page_views = EXCLUDED.total_page_views,
        unique_visitors = EXCLUDED.unique_visitors,
        bounce_count = EXCLUDED.bounce_count,
        total_product_views = EXCLUDED.total_product_views,
        total_add_to_cart = EXCLUDED.total_add_to_cart,
        total_checkout_initiated = EXCLUDED.total_checkout_initiated,
        total_searches = EXCLUDED.total_searches,
        mobile_sessions = EXCLUDED.mobile_sessions,
        tablet_sessions = EXCLUDED.tablet_sessions,
        desktop_sessions = EXCLUDED.desktop_sessions,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RPC function to increment page views and update bounce
-- ============================================
CREATE OR REPLACE FUNCTION increment_page_views(sid TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE analytics_sessions
    SET 
        page_views = page_views + 1,
        bounce = CASE WHEN page_views >= 1 THEN FALSE ELSE bounce END,
        updated_at = NOW()
    WHERE session_id = sid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RPC function to upsert top pages
-- ============================================
CREATE OR REPLACE FUNCTION upsert_top_page(
    p_date DATE,
    p_page_path TEXT,
    p_page_title TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO analytics_top_pages (date, page_path, page_title, views, unique_visitors)
    VALUES (p_date, p_page_path, p_page_title, 1, 1)
    ON CONFLICT (date, page_path) DO UPDATE SET
        views = analytics_top_pages.views + 1,
        page_title = COALESCE(EXCLUDED.page_title, analytics_top_pages.page_title);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RPC function to upsert top products
-- ============================================
CREATE OR REPLACE FUNCTION upsert_top_product(
    p_date DATE,
    p_product_id TEXT,
    p_product_title TEXT,
    p_is_cart BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO analytics_top_products (date, product_id, product_title, views, add_to_cart_count)
    VALUES (
        p_date, 
        p_product_id, 
        p_product_title, 
        CASE WHEN p_is_cart THEN 0 ELSE 1 END,
        CASE WHEN p_is_cart THEN 1 ELSE 0 END
    )
    ON CONFLICT (date, product_id) DO UPDATE SET
        views = CASE WHEN p_is_cart THEN analytics_top_products.views ELSE analytics_top_products.views + 1 END,
        add_to_cart_count = CASE WHEN p_is_cart THEN analytics_top_products.add_to_cart_count + 1 ELSE analytics_top_products.add_to_cart_count END,
        product_title = COALESCE(EXCLUDED.product_title, analytics_top_products.product_title);
END;
$$ LANGUAGE plpgsql;
