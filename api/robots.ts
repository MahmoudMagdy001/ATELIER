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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/robots_settings?select=custom_content,sitemap_url&id=eq.1`, { headers }).catch(() => null)
    const data = res?.ok ? await res.json() : []
    const setting = data && data[0] ? data[0] : null

    const content = setting?.custom_content || 'User-agent: *\nAllow: /\nDisallow: /admin/'
    const sitemapUrl = setting?.sitemap_url || `${baseUrl}/sitemap.xml`

    const robotsText = `${content.trim()}\n\nSitemap: ${sitemapUrl}\n`

    return new Response(robotsText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch {
    return new Response('User-agent: *\nAllow: /\nDisallow: /admin/\n', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
