export const config = {
  runtime: 'edge',
}

const SUPABASE_URL = 'https://edhhqwyjvbaomfgvzxuw.supabase.co'
const SUPABASE_KEY = 'sb_publishable_wJclZZrUlepKl18L-Shw2w_FfwTN9oZ'

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url)
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || url.host
    const proto = req.headers.get('x-forwarded-proto') || 'https'
    const baseUrl = `${proto}://${host}`

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    }

    // Fetch published items from Supabase in real-time
    const [articlesRes, productsRes, offersRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/articles?select=slug,created_at&status=eq.published`, { headers }).catch(() => null),
      fetch(`${SUPABASE_URL}/rest/v1/limited_editions?select=slug,created_at&status=eq.published`, { headers }).catch(() => null),
      fetch(`${SUPABASE_URL}/rest/v1/offers?select=slug,created_at&status=eq.published`, { headers }).catch(() => null),
    ])

    const articles: Array<{ slug: string; created_at?: string }> = articlesRes?.ok ? await articlesRes.json() : []
    const products: Array<{ slug: string; created_at?: string }> = productsRes?.ok ? await productsRes.json() : []
    const offers: Array<{ slug: string; created_at?: string }> = offersRes?.ok ? await offersRes.json() : []

    const today = new Date().toISOString().split('T')[0]

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

    const addUrl = (loc: string, priority: string, changefreq: string, lastmod?: string) => {
      xml += `  <url>\n`
      xml += `    <loc>${loc}</loc>\n`
      xml += `    <lastmod>${lastmod || today}</lastmod>\n`
      xml += `    <changefreq>${changefreq}</changefreq>\n`
      xml += `    <priority>${priority}</priority>\n`
      xml += `  </url>\n`
    }

    // Core Pages
    addUrl(`${baseUrl}/`, '1.0', 'daily')
    addUrl(`${baseUrl}/limited-edition`, '0.9', 'weekly')
    addUrl(`${baseUrl}/bespoke`, '0.9', 'weekly')
    addUrl(`${baseUrl}/offers`, '0.8', 'weekly')
    addUrl(`${baseUrl}/blog`, '0.8', 'weekly')

    // Products (Live from Dashboard/Supabase)
    products.forEach((p) => {
      if (!p.slug) return
      const mod = p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : today
      addUrl(`${baseUrl}/limited-edition/${p.slug}`, '0.9', 'weekly', mod)
    })

    // Offers (Live from Dashboard/Supabase)
    offers.forEach((o) => {
      if (!o.slug) return
      const mod = o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : today
      addUrl(`${baseUrl}/offers/${o.slug}`, '0.8', 'weekly', mod)
    })

    // Blog Articles (Live from Dashboard/Supabase)
    articles.forEach((a) => {
      if (!a.slug) return
      const mod = a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : today
      addUrl(`${baseUrl}/blog/${a.slug}`, '0.7', 'weekly', mod)
    })

    xml += `</urlset>\n`

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (err: unknown) {
    return new Response(`Error generating sitemap: ${(err as Error)?.message || 'Unknown error'}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
