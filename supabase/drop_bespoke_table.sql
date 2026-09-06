-- ==============================================================================
-- Migration: Drop bespoke_service Table
-- Description: The bespoke commissions page is now static and fully localized
--              via frontend i18n without any database overhead.
-- ==============================================================================

-- 1. Drop the bespoke_service table and any dependent policies / constraints
DROP TABLE IF EXISTS public.bespoke_service CASCADE;

-- 2. Optional: Clean up storage files in media-assets under bespoke folder if needed
-- DELETE FROM storage.objects WHERE bucket_id = 'media-assets' AND name LIKE 'bespoke/%';
