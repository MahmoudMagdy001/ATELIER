export interface ProductVariant {
  id: string
  name: string
  image: string
  price?: string | number
  sku?: string
  dimensions?: string
  material?: string
  [key: string]: unknown
}

export interface LimitedEdition {
  id: string
  title: string
  slug: string
  description: string | null
  main_image: string | null
  badge: string | null
  category_id: string | null
  status: 'published' | 'draft' | string
  display_order: number
  variants: ProductVariant[]
  created_at: string
  image_alt?: string | null
  image_title?: string | null
  meta_title?: string | null
  meta_description?: string | null
  seo_description?: string | null
  canonical_url?: string | null
  keywords?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  robots_index?: boolean
  robots_follow?: boolean
  robots_noarchive?: boolean
  robots_nosnippet?: boolean
  twitter_card?: string
  category?: Category | null
}

export interface OfferVariant {
  id?: string
  name: string
  image?: string | null
  price?: string | number | null
  original_price?: string | number | null
  sku?: string | null
  stock?: number | null
  in_stock?: boolean | null
  [key: string]: unknown
}

export interface Offer {
  id: string
  title: string
  slug: string
  description: string | null
  discount_label: string | null
  discount_text?: string | null
  cover_image: string | null
  banner_image?: string | null
  valid_from: string | null
  valid_until: string | null
  badge: string | null
  status: 'published' | 'draft' | string
  product_id: string | null
  variants: OfferVariant[]
  created_at: string
  image_alt?: string | null
  image_title?: string | null
  meta_title?: string | null
  meta_description?: string | null
  seo_description?: string | null
  canonical_url?: string | null
  keywords?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  robots_index?: boolean
  robots_follow?: boolean
  robots_noarchive?: boolean
  robots_nosnippet?: boolean
  twitter_card?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  author: string | null
  tags: string[] | null
  status: 'published' | 'draft' | string
  published_at: string | null
  created_at: string
  category_id?: string | null
  category?: Category | null
  meta_title?: string | null
  meta_description?: string | null
  seo_description?: string | null
  canonical_url?: string | null
  keywords?: string | null
  robots_index?: boolean
  robots_follow?: boolean
  robots_noarchive?: boolean
  robots_nosnippet?: boolean
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  twitter_card?: string
  json_ld?: Record<string, unknown> | null
  image_alt?: string | null
  image_title?: string | null
  caption?: string | null
  reading_time?: number
  word_count?: number
  views?: number
  seo_score?: number
}

export interface PortfolioItem {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string
  display_order: number
  is_visible: boolean
  created_at: string
}

export interface BespokeStep {
  step: string
  title: string
  description: string
}

export interface BespokeServiceConfig {
  id?: string
  hero_title?: string
  hero_subtitle?: string
  service_description?: string
  steps?: BespokeStep[]
  cta_text?: string
  hero_image?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url?: string | null
  type: 'products' | 'articles' | string
  display_order: number
  meta_title?: string | null
  meta_description?: string | null
  created_at: string
}

export interface RedirectRule {
  id: string
  source_path: string
  target_path: string
  status_code: number
  created_at: string
}

export interface SiteSettings {
  id: number
  site_name: string
  logo_url: string
  favicon_url: string
  site_description: string
  default_meta_title: string
  default_meta_description: string
  default_canonical?: string | null
  default_robots: string
  default_og_image: string
  google_verification?: string | null
  bing_verification?: string | null
  facebook_verification?: string | null
  pinterest_verification?: string | null
  yandex_verification?: string | null
  updated_at: string
}

export interface RobotsSettings {
  id: number
  sitemap_url?: string | null
  custom_content: string
  updated_at: string
}

export interface CustomScript {
  id: string
  name: string
  src_code: string
  location: 'head' | 'body' | string
  is_active: boolean
  created_at: string
}

export interface MediaItem {
  id: string
  name: string
  file_url: string
  url?: string
  title?: string | null
  file_path?: string
  file_type?: string
  file_size?: number
  width?: number | null
  height?: number | null
  alt_text?: string | null
  caption?: string | null
  folder?: string
  created_at: string
}

export interface AuthUser {
  id?: string
  email: string
  name?: string
  [key: string]: unknown
}
