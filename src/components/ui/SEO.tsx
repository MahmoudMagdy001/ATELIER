import { memo, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { adminService } from '../../features/admin/services/adminService'
import { CONTACT_INFO } from '../../constants/contactInfo'
import type { SiteSettings } from '../../types/database'
import type { SEOProps } from '../../types'

function getVerificationTokens(val?: string | null): string[] {
  if (!val) return []
  const str = String(val)
  const tokens = str.split(/[\n,]+/).map(t => {
    let clean = t.trim()
    const contentMatch = clean.match(/content=["']([^"']+)["']/i)
    if (contentMatch) clean = contentMatch[1]
    if (clean.includes('=')) clean = clean.split('=').pop() || ''
    return clean.trim()
  }).filter(Boolean)
  return Array.from(new Set(tokens))
}

function cleanVerificationCode(val?: string | null): string {
  if (!val) return ''
  const str = String(val).trim()
  const contentMatch = str.match(/content=["']([^"']+)["']/i)
  if (contentMatch) return contentMatch[1]
  return str
}

const SEO = memo(function SEO({
  title,
  description,
  image,
  slug,
  type = 'website',
  canonicalUrl,
  keywords,
  robotsIndex = true,
  robotsFollow = true,
  robotsNoarchive = false,
  robotsNosnippet = false,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard = 'summary_large_image',
  jsonLd,
}: SEOProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const siteUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://atelier-luxury.com'

  useEffect(() => {
    let isMounted = true
    adminService.fetchSettings().then(data => {
      if (isMounted && data) {
        setSettings(data)
      }
    }).catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const { t, i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'ar'
  const currentDir = currentLang === 'ar' ? 'rtl' : 'ltr'
  const isEn = currentLang === 'en'

  const defaultBrand = t('seo.defaultTitle')
  const defaultDesc = t('seo.defaultDescription')

  const dbTitle = isEn 
    ? (settings?.default_meta_title_en || settings?.site_name_en) 
    : (settings?.default_meta_title || settings?.site_name)

  const dbDesc = isEn
    ? (settings?.default_meta_description_en || settings?.site_description_en)
    : (settings?.default_meta_description || settings?.site_description)

  const rawTitle = title || dbTitle || defaultBrand || (isEn ? 'S&I Atelier | Bespoke Luxury Furniture & Interiors' : 'S&I Atelier | قطع حصرية وتنفيذ حسب الطلب')
  
  // Prevent duplicate brand name in title
  let fullTitle = rawTitle.trim()
  const hasBrand = /atelier/i.test(fullTitle)
  if (!hasBrand) {
    fullTitle = `${fullTitle} | S&I Atelier`
  }

  const finalDesc = description || dbDesc || defaultDesc
  const finalImage = image || ogImage || settings?.default_og_image || '/assets/hero.png'
  const finalSlug = slug || ''

  const finalCanonical = canonicalUrl || settings?.default_canonical || `${siteUrl}/${finalSlug}`
  const imageUrl = finalImage.startsWith('http') ? finalImage : `${siteUrl}${finalImage}`

  const robotsParts: string[] = []
  robotsParts.push(robotsIndex ? 'index' : 'noindex')
  robotsParts.push(robotsFollow ? 'follow' : 'nofollow')
  if (robotsNoarchive) robotsParts.push('noarchive')
  if (robotsNosnippet) robotsParts.push('nosnippet')
  const robotsString = robotsParts.join(', ')
  
  const isStandardRobots = robotsIndex === true && robotsFollow === true && !robotsNoarchive && !robotsNosnippet
  const finalRobots = isStandardRobots && settings?.default_robots ? settings.default_robots : robotsString

  return (
    <Helmet>
      {/* HTML Lang and Direction */}
      <html lang={currentLang} dir={currentDir} />

      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={finalCanonical} />
      <link rel="icon" type="image/png" href={settings?.favicon_url || '/logo.png?v=3'} />
      <link rel="shortcut icon" href={settings?.favicon_url || '/logo.png?v=3'} />
      <link rel="apple-touch-icon" href={settings?.favicon_url || '/logo.png?v=3'} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={finalRobots} />

      {/* Webmaster verification codes */}
      {getVerificationTokens(settings?.google_verification).map((token) => (
        <meta key={token} name="google-site-verification" content={token} />
      ))}
      {getVerificationTokens(settings?.bing_verification).map((token) => (
        <meta key={token} name="msvalidate.01" content={token} />
      ))}
      {settings?.yandex_verification && <meta name="yandex-verification" content={cleanVerificationCode(settings.yandex_verification)} />}
      {settings?.facebook_verification && <meta name="facebook-domain-verification" content={cleanVerificationCode(settings.facebook_verification)} />}
      {settings?.pinterest_verification && <meta name="p-domain-verify" content={cleanVerificationCode(settings.pinterest_verification)} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || finalDesc} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard || 'summary_large_image'} />
      <meta property="twitter:url" content={finalCanonical} />
      <meta property="twitter:title" content={ogTitle || fullTitle} />
      <meta property="twitter:description" content={ogDescription || finalDesc} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": settings?.site_name || CONTACT_INFO.brandFullName,
          "url": siteUrl,
          "logo": settings?.logo_url || `${siteUrl}/assets/logo.png`,
          "foundingDate": CONTACT_INFO.foundedDate,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": CONTACT_INFO.address,
            "addressCountry": "SA"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": CONTACT_INFO.phone,
            "contactType": "customer service"
          }
        })}
      </script>
    </Helmet>
  )
})

export default SEO
