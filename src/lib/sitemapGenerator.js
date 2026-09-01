import { supabase } from './supabase'

/**
 * Regenerates sitemap.xml and robots.txt and updates them in Supabase storage
 */
export async function regenerateSitemapAndRobots() {
  try {
    const siteUrl = window.location.origin || 'https://atelier-luxury.com'

    // Fetch all published items for sitemap urls
    const [postsRes, servicesRes, offersRes] = await Promise.all([
      supabase.from('posts').select('slug, created_at').eq('status', 'published'),
      supabase.from('services').select('slug, created_at').eq('status', 'published'),
      supabase.from('offers').select('slug, created_at').eq('status', 'published'),
    ])

    const posts = postsRes.data || []
    const services = servicesRes.data || []
    const offers = offersRes.data || []

    const urls = [
      { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${siteUrl}/services`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${siteUrl}/offers`, priority: '0.8', changefreq: 'daily' },
      { loc: `${siteUrl}/blog`, priority: '0.8', changefreq: 'daily' },
      { loc: `${siteUrl}/about`, priority: '0.5', changefreq: 'monthly' },
    ]

    posts.forEach((item) => {
      urls.push({
        loc: `${siteUrl}/blog/${item.slug}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: new Date(item.created_at || Date.now()).toISOString().split('T')[0],
      })
    })

    services.forEach((item) => {
      urls.push({
        loc: `${siteUrl}/services/${item.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: new Date(item.created_at || Date.now()).toISOString().split('T')[0],
      })
    })

    offers.forEach((item) => {
      urls.push({
        loc: `${siteUrl}/offers/${item.slug}`,
        priority: '0.8',
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

    let robotsText = 'User-agent: *\nAllow: /\nDisallow: /admin/\n'
    if (robotsData) {
      robotsText = `${robotsData.custom_content || 'User-agent: *\nAllow: /\nDisallow: /admin/'}\nSitemap: ${robotsData.sitemap_url || `${siteUrl}/sitemap.xml`}`
    } else {
      robotsText += `Sitemap: ${siteUrl}/sitemap.xml`
    }

    // Upload to public-assets bucket if available
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
  } catch (err) {
    console.warn('Sitemap/Robots generation fallback:', err.message)
    return null
  }
}
