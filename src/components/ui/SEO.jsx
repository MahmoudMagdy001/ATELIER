import { memo, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabase'

function getVerificationTokens(val) {
  if (!val) return []
  const str = String(val)
  const tokens = str.split(/[\n,]+/).map(t => {
    let clean = t.trim()
    const contentMatch = clean.match(/content=["']([^"']+)["']/i)
    if (contentMatch) clean = contentMatch[1]
    if (clean.includes('=')) clean = clean.split('=').pop()
    return clean.trim()
  }).filter(Boolean)
  return Array.from(new Set(tokens))
}

function cleanVerificationCode(val) {
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
}) {
  const [settings, setSettings] = useState(null)
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://atelier-luxury.com'

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle()
        if (data) {
          setSettings(data)
        }
      } catch (e) {
        // quiet fallback
      }
    }
    loadSettings()
  }, [])

  const defaultBrand = 'أتيليه للأثاث والتصميم الداخلي الفاخر'
  const defaultDesc = 'أتيليه - علامة رائدة في صناعة الأثاث الفاخر بالطلب والتصميم الداخلي المعماري للقصور والفيلات الراقية.'

  const finalTitle = title || settings?.default_meta_title || settings?.site_name || defaultBrand
  const finalDesc = description || settings?.default_meta_description || settings?.site_description || defaultDesc
  const finalImage = image || ogImage || settings?.default_og_image || '/assets/hero.png'
  const finalSlug = slug || ''
  
  const fullTitle = title 
    ? `${title} | ${settings?.site_name || defaultBrand}` 
    : (settings?.default_meta_title || defaultBrand)

  const finalCanonical = canonicalUrl || settings?.default_canonical || `${siteUrl}/${finalSlug}`
  const imageUrl = finalImage.startsWith('http') ? finalImage : `${siteUrl}${finalImage}`

  const robotsParts = []
  robotsParts.push(robotsIndex ? 'index' : 'noindex')
  robotsParts.push(robotsFollow ? 'follow' : 'nofollow')
  if (robotsNoarchive) robotsParts.push('noarchive')
  if (robotsNosnippet) robotsParts.push('nosnippet')
  const robotsString = robotsParts.join(', ')
  
  const isStandardRobots = robotsIndex === true && robotsFollow === true && !robotsNoarchive && !robotsNosnippet
  const finalRobots = isStandardRobots && settings?.default_robots ? settings.default_robots : robotsString

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={finalCanonical} />
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
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || finalDesc} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={finalCanonical} />
      <meta property="twitter:title" content={ogTitle || fullTitle} />
      <meta property="twitter:description" content={ogDescription || finalDesc} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
})

export default SEO
