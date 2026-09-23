export const config = {
  runtime: 'edge',
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ''

/** Escape XML special characters to prevent malformed output. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface SiteSettings {
  site_url: string
  sitemap_include_projects: boolean
  sitemap_include_services: boolean
  sitemap_include_posts: boolean
  sitemap_change_freq: string
  sitemap_priority_homepage: string
}

interface SlugRow {
  slug: string
  updated_at?: string
  created_at?: string
}

function buildXmlUrl(loc: string, priority: string, changefreq: string, lastmod?: string): string {
  const today = new Date().toISOString().split('T')[0]
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastmod ?? today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

function fallbackXml(siteUrl: string): string {
  const today = new Date().toISOString().split('T')[0]
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
    `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n` +
    `          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n` +
    `  <url>\n` +
    `    <loc>${escapeXml(siteUrl)}/</loc>\n` +
    `    <lastmod>${today}</lastmod>\n` +
    `    <changefreq>daily</changefreq>\n` +
    `    <priority>1.0</priority>\n` +
    `  </url>\n` +
    `</urlset>\n`
  )
}

export default async function handler(_req: Request): Promise<Response> {
  const xmlHeaders = {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  }

  // Guard: if env vars are missing, return minimal valid sitemap
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(fallbackXml('https://www.si-atelier.com'), {
      status: 200,
      headers: xmlHeaders,
    })
  }

  const fetchHeaders = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  }

  try {
    // Fetch site_settings (row id=1) and all published slugs in parallel
    const [settingsRes, projectsRes, servicesRes, postsRes] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/site_settings?select=site_url,sitemap_include_projects,sitemap_include_services,sitemap_include_posts,sitemap_change_freq,sitemap_priority_homepage&id=eq.1`,
        { headers: fetchHeaders },
      ).catch(() => null),
      fetch(
        `${SUPABASE_URL}/rest/v1/projects?select=slug,updated_at,created_at&status=eq.published`,
        { headers: fetchHeaders },
      ).catch(() => null),
      fetch(
        `${SUPABASE_URL}/rest/v1/services?select=slug,updated_at,created_at&status=eq.published`,
        { headers: fetchHeaders },
      ).catch(() => null),
      fetch(
        `${SUPABASE_URL}/rest/v1/posts?select=slug,updated_at,created_at&status=eq.published`,
        { headers: fetchHeaders },
      ).catch(() => null),
    ])

    const settingsData: SiteSettings[] = settingsRes?.ok ? await settingsRes.json() : []
    const projects: SlugRow[] = projectsRes?.ok ? await projectsRes.json() : []
    const services: SlugRow[] = servicesRes?.ok ? await servicesRes.json() : []
    const posts: SlugRow[] = postsRes?.ok ? await postsRes.json() : []

    const settings: SiteSettings = settingsData[0] ?? {
      site_url: 'https://www.si-atelier.com',
      sitemap_include_projects: true,
      sitemap_include_services: true,
      sitemap_include_posts: true,
      sitemap_change_freq: 'weekly',
      sitemap_priority_homepage: '1.0',
    }

    const siteUrl = (settings.site_url ?? 'https://www.si-atelier.com').replace(/\/$/, '')
    const changefreq = settings.sitemap_change_freq ?? 'weekly'
    const homePriority = settings.sitemap_priority_homepage ?? '1.0'
    const today = new Date().toISOString().split('T')[0]

    const urls: string[] = []

    // ── Homepage
    urls.push(buildXmlUrl(`${siteUrl}/`, homePriority, 'daily', today))

    // ── Static hash-anchor sections
    const staticSections = ['/#services', '/#projects', '/#reels', '/#blog', '/#clients', '/#contact']
    for (const section of staticSections) {
      urls.push(buildXmlUrl(`${siteUrl}${section}`, '0.7', changefreq, today))
    }

    // ── Dynamic: Projects
    if (settings.sitemap_include_projects) {
      for (const row of projects) {
        if (!row.slug) continue
        const lastmod = (row.updated_at ?? row.created_at ?? '').split('T')[0] || today
        urls.push(buildXmlUrl(`${siteUrl}/projects/${row.slug}`, '0.8', changefreq, lastmod))
      }
    }

    // ── Dynamic: Services
    if (settings.sitemap_include_services) {
      for (const row of services) {
        if (!row.slug) continue
        const lastmod = (row.updated_at ?? row.created_at ?? '').split('T')[0] || today
        urls.push(buildXmlUrl(`${siteUrl}/services/${row.slug}`, '0.8', changefreq, lastmod))
      }
    }

    // ── Dynamic: Posts (blog)
    if (settings.sitemap_include_posts) {
      for (const row of posts) {
        if (!row.slug) continue
        const lastmod = (row.updated_at ?? row.created_at ?? '').split('T')[0] || today
        urls.push(buildXmlUrl(`${siteUrl}/blog/${row.slug}`, '0.7', changefreq, lastmod))
      }
    }

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
      `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
      `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n` +
      `          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n` +
      urls.join('\n') +
      `\n</urlset>\n`

    return new Response(xml, { status: 200, headers: xmlHeaders })
  } catch {
    // Graceful fallback — return a minimal valid sitemap with just the homepage
    return new Response(fallbackXml('https://www.si-atelier.com'), {
      status: 200,
      headers: xmlHeaders,
    })
  }
}
