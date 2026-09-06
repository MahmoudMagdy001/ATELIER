-- ==============================================================================
-- S&I ATELIER - Multilingual Database Schema Migration (EXACT & SAFE)
-- Run this script in your Supabase Project SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- Matches `supabase_schema.sql` table names exactly.
-- ==============================================================================

-- 1. Limited Editions Table (القطع ذات الإصدار المحدود)
ALTER TABLE IF EXISTS public.limited_editions 
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS badge_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT;

-- Fallback if your table is named 'products'
ALTER TABLE IF EXISTS public.products 
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS badge_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT;

-- 2. Bespoke Service Table (صفحة خدمة التنفيذ حسب الطلب)
ALTER TABLE IF EXISTS public.bespoke_service 
  ADD COLUMN IF NOT EXISTS hero_title_en TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle_en TEXT,
  ADD COLUMN IF NOT EXISTS service_description_en TEXT,
  ADD COLUMN IF NOT EXISTS steps_en JSONB,
  ADD COLUMN IF NOT EXISTS cta_text_en TEXT;

-- Fallback if table was previously named 'bespoke_content'
ALTER TABLE IF EXISTS public.bespoke_content 
  ADD COLUMN IF NOT EXISTS hero_title_en TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle_en TEXT,
  ADD COLUMN IF NOT EXISTS service_description_en TEXT,
  ADD COLUMN IF NOT EXISTS steps_en JSONB,
  ADD COLUMN IF NOT EXISTS cta_text_en TEXT;

-- 3. Categories Table (التصنيفات للأثاث والمقالات)
ALTER TABLE IF EXISTS public.categories 
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT;

-- 3b. Site Settings Table (إعدادات الموقع العامة)
ALTER TABLE IF EXISTS public.site_settings 
  ADD COLUMN IF NOT EXISTS site_name_en TEXT,
  ADD COLUMN IF NOT EXISTS site_description_en TEXT,
  ADD COLUMN IF NOT EXISTS default_meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS default_meta_description_en TEXT;

-- 4. Portfolio Table (معرض أسبقيات الأعمال)
ALTER TABLE IF EXISTS public.portfolio 
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS category_en TEXT;

-- 5. Offers Table (العروض والباقات الحصرية)
ALTER TABLE IF EXISTS public.offers 
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS discount_label_en TEXT,
  ADD COLUMN IF NOT EXISTS badge_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT;

-- 6. Articles Table (المقالات والمجلة المعمارية)
ALTER TABLE IF EXISTS public.articles 
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS author_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT;

-- Fallback if articles table is named 'posts'
ALTER TABLE IF EXISTS public.posts 
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS author_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT;

-- ==============================================================================
-- Migration complete! You can run this script safely anytime (idempotent).
-- ==============================================================================
