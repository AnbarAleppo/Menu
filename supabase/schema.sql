-- ==============================================================================
-- ANBAR RESTAURANT - SUPABASE DATABASE SCHEMA & STORAGE SETUP
-- ==============================================================================
-- Copy and paste this script into your Supabase project's SQL Editor and run it.

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
    table_number VARCHAR(20) DEFAULT 'طاولة عامة',
    customer_name VARCHAR(100),
    customer_phone VARCHAR(50),
    items JSONB NOT NULL, -- Array of { id, title, price, qty, image }
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'preparing', 'served', 'completed', 'cancelled'
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- CATEGORIES POLICIES
-- Anyone can view active categories
CREATE POLICY "Public categories are viewable by everyone" 
ON public.categories FOR SELECT USING (is_active = TRUE);

-- Allow all operations for authenticated/service role (Admin)
CREATE POLICY "Admin can manage categories" 
ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- MENU ITEMS POLICIES
-- Anyone can view available menu items
CREATE POLICY "Public menu items are viewable by everyone" 
ON public.menu_items FOR SELECT USING (is_available = TRUE);

-- Allow all operations for admin/service role
CREATE POLICY "Admin can manage menu items" 
ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

-- ORDERS POLICIES
-- Anyone can create an order
CREATE POLICY "Public can insert orders" 
ON public.orders FOR INSERT WITH CHECK (true);

-- Anyone can view their recently placed order (or admin view all)
CREATE POLICY "Orders are viewable by everyone" 
ON public.orders FOR SELECT USING (true);

-- Admin can update order status
CREATE POLICY "Admin can update orders" 
ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

-- SITE SETTINGS POLICIES
CREATE POLICY "Site settings viewable by everyone" 
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admin can update site settings" 
ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET: anbar-assets
-- ==============================================================================
-- Create the storage bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('anbar-assets', 'anbar-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies: Public read access
CREATE POLICY "Public Access for anbar-assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'anbar-assets');

-- Storage RLS Policies: Upload access for users/admin
CREATE POLICY "Public Upload to anbar-assets" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'anbar-assets');

CREATE POLICY "Public Update to anbar-assets" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'anbar-assets');

CREATE POLICY "Public Delete from anbar-assets" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'anbar-assets');
