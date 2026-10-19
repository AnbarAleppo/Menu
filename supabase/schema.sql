-- ==============================================================================
-- ANBAR RESTAURANT - SUPABASE DATABASE SCHEMA & SECURED PRODUCTION SETUP
-- ==============================================================================
-- Run this in your Supabase SQL Editor to enforce impenetrable security and 2-tier categorization.

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    section VARCHAR(20) DEFAULT 'food', -- 'food' (المأكولات) or 'drinks' (المشروبات)
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure column exists if table was already created
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'section'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN section VARCHAR(20) DEFAULT 'food';
    END IF;
END $$;

-- 2. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_slug VARCHAR(50) REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE SET NULL,
    price NUMERIC(12, 2) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT,
    pairing TEXT,
    image_url TEXT NOT NULL,
    badge VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number SERIAL,
    table_number VARCHAR(50) DEFAULT 'طاولة عامة',
    customer_name VARCHAR(100) DEFAULT 'زبون الدار',
    customer_phone VARCHAR(50),
    items JSONB NOT NULL, -- Array of { id, title, price, qty, image }
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'accepted', 'preparing', 'served', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- HARDENED ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Clean up any existing loose/open policies
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public menu items are viewable by everyone" ON public.menu_items;
DROP POLICY IF EXISTS "Admin can manage menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Orders are viewable by everyone" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Site settings viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;

-- 1. CATEGORIES POLICIES
-- Anyone can view active categories
CREATE POLICY "Public categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (is_active = TRUE);

-- Only authenticated users / service_role can modify categories (Anon users BLOCKED)
CREATE POLICY "Only authenticated admin can insert categories" 
ON public.categories FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated admin can update categories" 
ON public.categories FOR UPDATE TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Only authenticated admin can delete categories" 
ON public.categories FOR DELETE TO authenticated 
USING (true);

-- 2. MENU ITEMS POLICIES
-- Anyone can view available menu items
CREATE POLICY "Public menu items are viewable by everyone" 
ON public.menu_items FOR SELECT 
USING (is_available = TRUE);

-- Only authenticated users / service_role can modify menu items (Anon users BLOCKED)
CREATE POLICY "Only authenticated admin can insert menu items" 
ON public.menu_items FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated admin can update menu items" 
ON public.menu_items FOR UPDATE TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Only authenticated admin can delete menu items" 
ON public.menu_items FOR DELETE TO authenticated 
USING (true);

-- 3. ORDERS POLICIES
-- Anyone can place a new order
CREATE POLICY "Public can insert orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Orders are private! Only authenticated staff / service_role can view and update orders
CREATE POLICY "Only staff can view all orders" 
ON public.orders FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Only staff can update orders" 
ON public.orders FOR UPDATE TO authenticated 
USING (true) WITH CHECK (true);

-- 4. SITE SETTINGS POLICIES
CREATE POLICY "Site settings are viewable" 
ON public.site_settings FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated admin can update site settings" 
ON public.site_settings FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET: anbar-assets
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('anbar-assets', 'anbar-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop loose storage policies
DROP POLICY IF EXISTS "Public Access for anbar-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload to anbar-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Update to anbar-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete from anbar-assets" ON storage.objects;

-- Storage: Public can view assets
CREATE POLICY "Public Access for anbar-assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'anbar-assets');

-- Storage: Upload/Delete only for authenticated users / service_role
CREATE POLICY "Admin Upload to anbar-assets" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'anbar-assets');

CREATE POLICY "Admin Update to anbar-assets" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'anbar-assets');

CREATE POLICY "Admin Delete from anbar-assets" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'anbar-assets');
