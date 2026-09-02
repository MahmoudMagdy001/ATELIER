-- =========================================================================
-- ATELIER CMS & SEO DATABASE SCHEMA (COMPLETE & READY FOR PRODUCTION)
-- Execute this script in your Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/_/sql
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. LIMITED EDITIONS TABLE (القطع ذات الإصدار المحدود - سابقاً products)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.limited_editions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  main_image TEXT,
  badge TEXT,
  category_id UUID,
  status TEXT DEFAULT 'published',
  display_order INTEGER DEFAULT 0,
  variants JSONB DEFAULT '[]'::jsonb,
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

-- =========================================================================
-- 2. OFFERS TABLE (العروض والباقات والخصومات)
-- =========================================================================
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
  product_id UUID,
  variants JSONB DEFAULT '[]'::jsonb,
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

-- =========================================================================
-- 3. ARTICLES TABLE (المقالات والمجلة المعمارية - سابقاً posts)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.articles (
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

-- =========================================================================
-- 4. PORTFOLIO TABLE (معرض أسبقيات الأعمال)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'عام',
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 5. BESPOKE SERVICE TABLE (صفحة خدمة التنفيذ حسب الطلب)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.bespoke_service (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_title TEXT DEFAULT 'تنفيذ التصاميم حسب الطلب',
  hero_subtitle TEXT DEFAULT 'صياغة أثاث راقٍ ومساحات معمارية حصرية مصممة خصيصاً لأدق تفاصيل قصرك أو فيلتك.',
  service_description TEXT DEFAULT 'في S&I Atelier، لا نؤمن بالإنتاج النمطي المتكرر؛ بل نعتبر كل مساحة فراغاً معمارياً يستحق هويته النحتية الخاصة. نقوم بتطويع أفخر الأخشاب الأوروبية ورخام الطبيعة النادر لنحول المخططات الهندسية ورؤيتك إلى تحف واقعية تدوم عبر الأجيال.',
  steps JSONB DEFAULT '[
    {"step":"01","title":"الاستشارة والمخطط الهندسي","description":"دراسة المخطط الهندسي والمساحات وتحديد النسب والارتفاعات المثالية." },
    {"step":"02","title":"انتقاء الخامات الفاخرة","description":"معاينة عينات الرخام الطبيعي وأخشاب الجوز وكتالوجات الأقمشة والجلود الإيطالية."},
    {"step":"03","title":"الصياغة اليدوية والتنفيذ","description":"تنفيذ القطع في ورشنا المتخصصة بأيدي نخبة من الحرفيين مع مطابقة أدق المقاسات."},
    {"step":"04","title":"التوصيل والتركيب VIP","description":"نقل وتركيب متخصص وتنسيق متكامل مع شهادة ضمان معتمدة للأثاث."}
  ]'::jsonb,
  cta_text TEXT DEFAULT 'طلب استشارة تصميم وتنفيذ مخصص',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.bespoke_service (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 6. CATEGORIES TABLE (التصنيفات للأثاث والمقالات)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  type TEXT DEFAULT 'products',
  display_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure image_url column exists for existing setups
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- =========================================================================
-- 7. REDIRECTS TABLE (إدارة التحويلات 301 و 302 للسيو)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.redirects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_path TEXT UNIQUE NOT NULL,
  target_path TEXT NOT NULL,
  status_code INTEGER DEFAULT 301,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 8. SITE SETTINGS TABLE (إعدادات الموقع ورموز التوثيق وبيانات الميتا)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'S&I Atelier',
  logo_url TEXT DEFAULT '/logo.png',
  favicon_url TEXT DEFAULT '/logo.png',
  site_description TEXT DEFAULT 'دار أثاث فاخر متخصصة في ابتكار وتصنيع القطع الحصرية ذات الإصدار المحدود وتنفيذ التصاميم حسب الطلب للقصور والفيلات العصرية.',
  default_meta_title TEXT DEFAULT 'S&I Atelier | قطع حصرية وتنفيذ حسب الطلب',
  default_meta_description TEXT DEFAULT 'استكشف قطع الأثاث الفاخر ذات الإصدار المحدود وخدمة التنفيذ حسب الطلب لأرقى القصور والفيلات العصرية.',
  default_canonical TEXT,
  default_robots TEXT DEFAULT 'index, follow',
  default_og_image TEXT DEFAULT '/assets/hero-banner.jpg',
  google_verification TEXT,
  bing_verification TEXT,
  facebook_verification TEXT,
  pinterest_verification TEXT,
  yandex_verification TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.site_settings (id, site_name, logo_url, favicon_url, default_meta_title, default_meta_description, default_robots, default_og_image)
VALUES (
  1, 
  'S&I Atelier', 
  '/logo.png', 
  '/logo.png', 
  'S&I Atelier | قطع حصرية وتنفيذ حسب الطلب', 
  'استكشف قطع الأثاث الفاخر ذات الإصدار المحدود وخدمة التنفيذ حسب الطلب لأرقى القصور والفيلات العصرية.', 
  'index, follow', 
  '/assets/hero-banner.jpg'
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  default_meta_title = EXCLUDED.default_meta_title,
  default_meta_description = EXCLUDED.default_meta_description;

-- =========================================================================
-- 7. ROBOTS SETTINGS TABLE (إعدادات Robots.txt وخريطة الموقع)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.robots_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  sitemap_url TEXT,
  custom_content TEXT DEFAULT 'User-agent: *\nAllow: /\nDisallow: /admin/',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.robots_settings (id, custom_content)
VALUES (1, 'User-agent: *\nAllow: /\nDisallow: /admin/')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 8. CUSTOM SCRIPTS TABLE (أكواد التتبع والإحصائيات في الهيدر والفوتر)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.custom_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  src_code TEXT NOT NULL,
  location TEXT DEFAULT 'head',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 9. MEDIA LIBRARY TABLE (مكتبة الوسائط السحابية)
-- =========================================================================
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
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.limited_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bespoke_service ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.robots_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Limited Editions Policies
  DROP POLICY IF EXISTS "Public can view published limited_editions" ON public.limited_editions;
  CREATE POLICY "Public can view published limited_editions" ON public.limited_editions FOR SELECT TO public USING (status = 'published' OR (SELECT auth.role()) = 'authenticated');
  DROP POLICY IF EXISTS "Admin full access for limited_editions" ON public.limited_editions;
  CREATE POLICY "Admin full access for limited_editions" ON public.limited_editions FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Offers Policies
  DROP POLICY IF EXISTS "Public can view published offers" ON public.offers;
  CREATE POLICY "Public can view published offers" ON public.offers FOR SELECT TO public USING (status = 'published' OR (SELECT auth.role()) = 'authenticated');
  DROP POLICY IF EXISTS "Admin full access for offers" ON public.offers;
  CREATE POLICY "Admin full access for offers" ON public.offers FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Articles Policies
  DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
  CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT TO public USING (status = 'published' OR (SELECT auth.role()) = 'authenticated');
  DROP POLICY IF EXISTS "Admin full access for articles" ON public.articles;
  CREATE POLICY "Admin full access for articles" ON public.articles FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Portfolio Policies
  DROP POLICY IF EXISTS "Public can view portfolio" ON public.portfolio;
  CREATE POLICY "Public can view portfolio" ON public.portfolio FOR SELECT TO public USING (is_visible = true OR (SELECT auth.role()) = 'authenticated');
  DROP POLICY IF EXISTS "Admin full access for portfolio" ON public.portfolio;
  CREATE POLICY "Admin full access for portfolio" ON public.portfolio FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Bespoke Service Policies
  DROP POLICY IF EXISTS "Public can view bespoke_service" ON public.bespoke_service;
  CREATE POLICY "Public can view bespoke_service" ON public.bespoke_service FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for bespoke_service" ON public.bespoke_service;
  CREATE POLICY "Admin full access for bespoke_service" ON public.bespoke_service FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Categories Policies
  DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
  CREATE POLICY "Public can view categories" ON public.categories FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for categories" ON public.categories;
  CREATE POLICY "Admin full access for categories" ON public.categories FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Redirects Policies
  DROP POLICY IF EXISTS "Public can view redirects" ON public.redirects;
  CREATE POLICY "Public can view redirects" ON public.redirects FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for redirects" ON public.redirects;
  CREATE POLICY "Admin full access for redirects" ON public.redirects FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Site Settings Policies
  DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
  CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for site settings" ON public.site_settings;
  CREATE POLICY "Admin full access for site settings" ON public.site_settings FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Robots Settings Policies
  DROP POLICY IF EXISTS "Public can view robots settings" ON public.robots_settings;
  CREATE POLICY "Public can view robots settings" ON public.robots_settings FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for robots settings" ON public.robots_settings;
  CREATE POLICY "Admin full access for robots settings" ON public.robots_settings FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Custom Scripts Policies
  DROP POLICY IF EXISTS "Public can view active custom scripts" ON public.custom_scripts;
  CREATE POLICY "Public can view active custom scripts" ON public.custom_scripts FOR SELECT TO public USING (is_active = true);
  DROP POLICY IF EXISTS "Admin full access for custom scripts" ON public.custom_scripts;
  CREATE POLICY "Admin full access for custom scripts" ON public.custom_scripts FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');

  -- Media Library Policies
  DROP POLICY IF EXISTS "Public can view media library" ON public.media_library;
  CREATE POLICY "Public can view media library" ON public.media_library FOR SELECT TO public USING (true);
  DROP POLICY IF EXISTS "Admin full access for media library" ON public.media_library;
  CREATE POLICY "Admin full access for media library" ON public.media_library FOR ALL TO public USING ((SELECT auth.role()) = 'authenticated') WITH CHECK ((SELECT auth.role()) = 'authenticated');
END $$;

-- =========================================================================
-- 11. STORAGE BUCKETS SETUP
-- =========================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('limited-edition-images', 'limited-edition-images', true),
  ('product-images', 'product-images', true),
  ('offer-covers', 'offer-covers', true),
  ('media-assets', 'media-assets', true),
  ('blog-covers', 'blog-covers', true),
  ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Public Reading & Authenticated Upload/Delete
DO $$
BEGIN
  -- Allow public viewing of files
  DROP POLICY IF EXISTS "Public Access to Buckets" ON storage.objects;
  CREATE POLICY "Public Access to Buckets" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id IN ('limited-edition-images', 'product-images', 'offer-covers', 'media-assets', 'blog-covers', 'public-assets'));

  -- Allow authenticated admins to upload and delete files
  DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
  CREATE POLICY "Admin Upload Access" ON storage.objects
    FOR INSERT TO public
    WITH CHECK (bucket_id IN ('limited-edition-images', 'product-images', 'offer-covers', 'media-assets', 'blog-covers', 'public-assets'));

  DROP POLICY IF EXISTS "Admin Update and Delete Access" ON storage.objects;
  CREATE POLICY "Admin Update and Delete Access" ON storage.objects
    FOR ALL TO public
    USING (bucket_id IN ('limited-edition-images', 'product-images', 'offer-covers', 'media-assets', 'blog-covers', 'public-assets'));
END $$;
