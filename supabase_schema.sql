-- =========================================================================
-- ATELIER CMS & SEO DATABASE SCHEMA (Adapted from Milaf without Trips/Cruises)
-- Execute this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  meta_title TEXT,
  meta_description TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  keywords TEXT,
  robots_index BOOLEAN DEFAULT TRUE,
  robots_follow BOOLEAN DEFAULT TRUE,
  robots_noarchive BOOLEAN DEFAULT FALSE,
  robots_nosnippet BOOLEAN DEFAULT FALSE,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  json_ld JSONB,
  category_id UUID,
  image_alt TEXT,
  image_title TEXT,
  caption TEXT,
  reading_time INTEGER DEFAULT 1,
  word_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  status TEXT DEFAULT 'published',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  badge TEXT,
  subtitle TEXT,
  full_content TEXT,
  gallery TEXT[],
  features TEXT[],
  image_alt TEXT,
  image_title TEXT,
  meta_title TEXT,
  meta_description TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  robots_index BOOLEAN DEFAULT TRUE,
  robots_follow BOOLEAN DEFAULT TRUE,
  robots_noarchive BOOLEAN DEFAULT FALSE,
  robots_nosnippet BOOLEAN DEFAULT FALSE,
  twitter_card TEXT DEFAULT 'summary_large_image'
);

-- 3. OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_label TEXT,
  cover_image TEXT,
  valid_from DATE,
  valid_until DATE,
  badge TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  image_alt TEXT,
  image_title TEXT,
  meta_title TEXT,
  meta_description TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  robots_index BOOLEAN DEFAULT TRUE,
  robots_follow BOOLEAN DEFAULT TRUE,
  robots_noarchive BOOLEAN DEFAULT FALSE,
  robots_nosnippet BOOLEAN DEFAULT FALSE,
  twitter_card TEXT DEFAULT 'summary_large_image'
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'blog',
  display_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REDIRECTS TABLE
CREATE TABLE IF NOT EXISTS public.redirects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_path TEXT UNIQUE NOT NULL,
  target_path TEXT NOT NULL,
  status_code INTEGER DEFAULT 301,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'أتيليه للأثاث والتصميم الداخلي الفاخر',
  logo_url TEXT,
  favicon_url TEXT,
  site_description TEXT,
  default_meta_title TEXT,
  default_meta_description TEXT,
  default_canonical TEXT,
  default_robots TEXT DEFAULT 'index, follow',
  default_og_image TEXT,
  google_verification TEXT,
  bing_verification TEXT,
  facebook_verification TEXT,
  pinterest_verification TEXT,
  yandex_verification TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure row id 1 exists
INSERT INTO public.site_settings (id, site_name)
VALUES (1, 'أتيليه للأثاث والتصميم الداخلي الفاخر')
ON CONFLICT (id) DO NOTHING;

-- 7. ROBOTS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.robots_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  sitemap_url TEXT,
  custom_content TEXT DEFAULT 'User-agent: *\nAllow: /\nDisallow: /admin/',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.robots_settings (id, custom_content)
VALUES (1, 'User-agent: *\nAllow: /\nDisallow: /admin/')
ON CONFLICT (id) DO NOTHING;

-- 8. CUSTOM SCRIPTS TABLE
CREATE TABLE IF NOT EXISTS public.custom_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  src_code TEXT NOT NULL,
  location TEXT DEFAULT 'head',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  file_path TEXT UNIQUE NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  title TEXT,
  caption TEXT,
  folder TEXT DEFAULT '/',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.robots_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Public Read & Admin Full Access Policies
DO $$ 
BEGIN
  -- Posts
  DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
  CREATE POLICY "Public can view published posts" ON public.posts FOR SELECT TO public USING (status = 'published' OR (SELECT auth.role()) = 'authenticated');
  DROP POLICY IF EXISTS "Admin full access for posts" ON public.posts;
  CREATE POLICY "Admin full access for posts" ON public.posts FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Services
  DROP POLICY IF EXISTS "Public can view published services" ON public.services;
  CREATE POLICY "Public can view published services" ON public.services FOR SELECT TO public USING (status = 'published' OR (SELECT auth.role()) = 'authenticated');
  DROP POLICY IF EXISTS "Admin full access for services" ON public.services;
  CREATE POLICY "Admin full access for services" ON public.services FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Offers
  DROP POLICY IF EXISTS "Public can view published offers" ON public.offers;
  CREATE POLICY "Public can view published offers" ON public.offers FOR SELECT TO public USING (status = 'published' OR (SELECT auth.role()) = 'authenticated');
  DROP POLICY IF EXISTS "Admin full access for offers" ON public.offers;
  CREATE POLICY "Admin full access for offers" ON public.offers FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Categories
  DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
  CREATE POLICY "Public can view categories" ON public.categories FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for categories" ON public.categories;
  CREATE POLICY "Admin full access for categories" ON public.categories FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Redirects
  DROP POLICY IF EXISTS "Public can view redirects" ON public.redirects;
  CREATE POLICY "Public can view redirects" ON public.redirects FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for redirects" ON public.redirects;
  CREATE POLICY "Admin full access for redirects" ON public.redirects FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Site Settings
  DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
  CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for site settings" ON public.site_settings;
  CREATE POLICY "Admin full access for site settings" ON public.site_settings FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Robots Settings
  DROP POLICY IF EXISTS "Public can view robots settings" ON public.robots_settings;
  CREATE POLICY "Public can view robots settings" ON public.robots_settings FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for robots settings" ON public.robots_settings;
  CREATE POLICY "Admin full access for robots settings" ON public.robots_settings FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Custom Scripts
  DROP POLICY IF EXISTS "Public can view active custom scripts" ON public.custom_scripts;
  CREATE POLICY "Public can view active custom scripts" ON public.custom_scripts FOR SELECT TO public USING (is_active = true);
  DROP POLICY IF EXISTS "Admin full access for custom scripts" ON public.custom_scripts;
  CREATE POLICY "Admin full access for custom scripts" ON public.custom_scripts FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Media Library
  DROP POLICY IF EXISTS "Public can view media library" ON public.media_library;
  CREATE POLICY "Public can view media library" ON public.media_library FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for media library" ON public.media_library;
  CREATE POLICY "Admin full access for media library" ON public.media_library FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');
END $$;

-- =========================================================================
-- STORAGE BUCKETS (Run via Storage in Supabase Dashboard or SQL)
-- Required Buckets:
-- 1. 'media-assets' (Public)
-- 2. 'blog-covers' (Public)
-- 3. 'service-images' (Public)
-- 4. 'offer-covers' (Public)
-- 5. 'public-assets' (Public)
-- =========================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('media-assets', 'media-assets', true),
  ('blog-covers', 'blog-covers', true),
  ('service-images', 'service-images', true),
  ('offer-covers', 'offer-covers', true),
  ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;
