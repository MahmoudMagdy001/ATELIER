import type { VercelRequest, VercelResponse } from '@vercel/node'

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://edhhqwyjvbaomfgvzxuw.supabase.co'

const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_wJclZZrUlepKl18L-Shw2w_FfwTN9oZ'

/** Escape XML special characters to prevent malformed output. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface SiteSettingsRow {
  site_url?: string
  default_canonical?: string
  sitemap_include_projects?: boolean
  sitemap_include_services?: boolean
  sitemap_include_posts?: boolean
  sitemap_change_freq?: string
  sitemap_priority_homepage?: string
  [key: string]: unknown
}

interface SlugItem {
  slug: string
  updated_at?: string
  created_at?: string
  published_at?: string
}

function buildXmlUrl(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod?: string,
): string {
  const today = new Date().toISOString().split('T')[0]
  const dateStr = lastmod ? lastmod.split('T')[0] : today
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${dateStr}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

function generateMinimalSitemap(siteUrl: string): string {
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

async function fetchTableRows(
  endpoint: string,
  headers: Record<string, string>,
): Promise<SlugItem[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, { headers })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? (data as SlugItem[]) : []
  } catch {
    return []
  }
}

export default async function handler(
  req: VercelRequest | Request,
  res?: VercelResponse,
) {
  const defaultBaseUrl = 'https://www.si-atelier.com'

  // Guard: if credentials are completely missing, return minimal valid sitemap
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const fallbackXml = generateMinimalSitemap(defaultBaseUrl)
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      return res.status(200).send(fallbackXml)
    }
    return new Response(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  }

  const fetchHeaders = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  }

  try {
    // 1. Fetch site_settings and all content tables in parallel with fault-tolerance
    const [
      settingsRes,
      articles,
      posts,
      limitedEditions,
      projects,
      offers,
      services,
    ] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*&id=eq.1`, {
        headers: fetchHeaders,
      }).catch(() => null),
      fetchTableRows('articles?select=slug,updated_at,created_at,published_at&status=eq.published', fetchHeaders),
      fetchTableRows('posts?select=slug,updated_at,created_at&status=eq.published', fetchHeaders),
      fetchTableRows('limited_editions?select=slug,created_at&status=eq.published', fetchHeaders),
      fetchTableRows('projects?select=slug,updated_at,created_at&status=eq.published', fetchHeaders),
      fetchTableRows('offers?select=slug,created_at&status=eq.published', fetchHeaders),
      fetchTableRows('services?select=slug,updated_at,created_at&status=eq.published', fetchHeaders),
    ])

    const settingsList: SiteSettingsRow[] = settingsRes?.ok ? await settingsRes.json() : []
    const settings: SiteSettingsRow = settingsList[0] || {}

    const rawSiteUrl =
      settings.site_url ||
      settings.default_canonical ||
      process.env.VITE_SITE_URL ||
      defaultBaseUrl

    const siteUrl = rawSiteUrl.replace(/\/$/, '')
    const includeProjects = settings.sitemap_include_projects !== false
    const includeServices = settings.sitemap_include_services !== false
    const includePosts = settings.sitemap_include_posts !== false
    const changefreq = settings.sitemap_change_freq || 'weekly'
    const homePriority = settings.sitemap_priority_homepage || '1.0'
    const today = new Date().toISOString().split('T')[0]

    const addedLocs = new Set<string>()
    const urls: string[] = []

    const addUrl = (loc: string, priority: string, freq: string, lastmod?: string) => {
      if (addedLocs.has(loc)) return
      addedLocs.add(loc)
      urls.push(buildXmlUrl(loc, priority, freq, lastmod))
    }

    // ── 1. Homepage
    addUrl(`${siteUrl}/`, homePriority, 'daily', today)

    // ── 2. Primary Public Pages
    addUrl(`${siteUrl}/limited-edition`, '0.9', 'weekly', today)
    addUrl(`${siteUrl}/bespoke`, '0.9', 'weekly', today)
    addUrl(`${siteUrl}/blog`, '0.8', 'daily', today)
    addUrl(`${siteUrl}/offers`, '0.85', 'weekly', today)

    // ── 3. Static Hash-Anchor Sections
    const staticSections = [
      '/#services',
      '/#projects',
      '/#reels',
      '/#blog',
      '/#clients',
      '/#contact',
    ]
    for (const section of staticSections) {
      addUrl(`${siteUrl}${section}`, '0.7', changefreq, today)
    }

    // ── 4. Dynamic: Projects / Limited Editions
    if (includeProjects) {
      // From limited_editions (the atelier exclusive pieces)
      for (const row of limitedEditions) {
        if (!row.slug) continue
        const lastmod = row.updated_at || row.created_at || today
        addUrl(`${siteUrl}/limited-edition/${row.slug}`, '0.85', changefreq, lastmod)
        addUrl(`${siteUrl}/projects/${row.slug}`, '0.8', changefreq, lastmod)
      }
      // From projects table (if defined in Supabase)
      for (const row of projects) {
        if (!row.slug) continue
        const lastmod = row.updated_at || row.created_at || today
        addUrl(`${siteUrl}/projects/${row.slug}`, '0.8', changefreq, lastmod)
      }
    }

    // ── 5. Dynamic: Services / Offers / Suites
    if (includeServices) {
      addUrl(`${siteUrl}/services`, '0.8', changefreq, today)
      // From offers table (the curated suites & bespoke packages)
      for (const row of offers) {
        if (!row.slug) continue
        const lastmod = row.updated_at || row.created_at || today
        addUrl(`${siteUrl}/services/${row.slug}`, '0.8', changefreq, lastmod)
        addUrl(`${siteUrl}/offers/${row.slug}`, '0.8', changefreq, lastmod)
      }
      // From services table (if defined in Supabase)
      for (const row of services) {
        if (!row.slug) continue
        const lastmod = row.updated_at || row.created_at || today
        addUrl(`${siteUrl}/services/${row.slug}`, '0.8', changefreq, lastmod)
      }
    }

    // ── 6. Dynamic: Posts / Articles (المجلة المعمارية)
    if (includePosts) {
      // From articles table
      for (const row of articles) {
        if (!row.slug) continue
        const lastmod = row.updated_at || row.published_at || row.created_at || today
        addUrl(`${siteUrl}/blog/${row.slug}`, '0.75', changefreq, lastmod)
      }
      // From posts table (if defined in Supabase)
      for (const row of posts) {
        if (!row.slug) continue
        const lastmod = row.updated_at || row.created_at || today
        addUrl(`${siteUrl}/blog/${row.slug}`, '0.75', changefreq, lastmod)
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

    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      return res.status(200).send(xml)
    }

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    const fallback = generateMinimalSitemap(defaultBaseUrl)
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      return res.status(200).send(fallback)
    }
    return new Response(fallback, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  }
}
