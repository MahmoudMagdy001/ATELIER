import { supabase } from './supabase'
import type { RobotsSettings } from '../types/database'

export interface SitemapAndRobotsResult {
  xml: string
  robotsText: string
}

/**
 * Regenerates sitemap.xml and robots.txt and updates them in Supabase storage
 */
export async function regenerateSitemapAndRobots(): Promise<SitemapAndRobotsResult | null> {
  try {
    const siteUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://atelier-luxury.com'

    // Fetch all published items for sitemap urls
    const [articlesRes, productsRes] = await Promise.all([
      supabase.from('articles').select('slug, created_at').eq('status', 'published'),
      supabase.from('limited_editions').select('slug, created_at').eq('status', 'published'),
    ])

    const articles = (articlesRes.data as Array<{ slug: string; created_at: string }>) || []
    const products = (productsRes.data as Array<{ slug: string; created_at: string }>) || []

    interface SitemapUrlItem {
      loc: string
      priority: string
      changefreq: string
      lastmod?: string
    }

    const urls: SitemapUrlItem[] = [
      { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${siteUrl}/limited-edition`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${siteUrl}/bespoke`, priority: '0.9', changefreq: 'weekly' },
    ]

    products.forEach((item) => {
      urls.push({
        loc: `${siteUrl}/limited-edition/${item.slug}`,
        priority: '0.9',
        changefreq: 'weekly',
        lastmod: new Date(item.created_at || Date.now()).toISOString().split('T')[0],
      })
    })

    articles.forEach((item) => {
      urls.push({
        loc: `${siteUrl}/blog/${item.slug}`,
        priority: '0.6',
        changefreq: 'weekly',
        lastmod: new Date(item.created_at || Date.now()).toISOString().split('T')[0],
      })
    })

    // Rebuild Sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    urls.forEach((u) => {
      xml += `  <url>\n`
      xml += `    <loc>${u.loc}</loc>\n`
      xml += `    <lastmod>${u.lastmod || new Date().toISOString().split('T')[0]}</lastmod>\n`
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`
      xml += `    <priority>${u.priority}</priority>\n`
      xml += `  </url>\n`
    })
    xml += `</urlset>\n`

    // Fetch robots.txt settings
    const { data: robotsData } = await supabase
      .from('robots_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    const typedRobots = robotsData as RobotsSettings | null

    let robotsText = 'User-agent: *\nAllow: /\nDisallow: /admin/\n'
    if (typedRobots) {
      robotsText = `${typedRobots.custom_content || 'User-agent: *\nAllow: /\nDisallow: /admin/'}\nSitemap: ${typedRobots.sitemap_url || `${siteUrl}/sitemap.xml`}`
    } else {
      robotsText += `Sitemap: ${siteUrl}/sitemap.xml`
    }

    const sitemapBlob = new Blob([xml], { type: 'application/xml' })
    const robotsBlob = new Blob([robotsText], { type: 'text/plain' })

    await Promise.allSettled([
      supabase.storage.from('public-assets').upload('sitemap.xml', sitemapBlob, {
        contentType: 'application/xml',
        upsert: true,
      }),
      supabase.storage.from('public-assets').upload('robots.txt', robotsBlob, {
        contentType: 'text/plain',
        upsert: true,
      }),
    ])

    return { xml, robotsText }
  } catch (err: unknown) {
    console.warn('Sitemap/Robots generation fallback:', (err as Error)?.message || err)
    return null
  }
}
