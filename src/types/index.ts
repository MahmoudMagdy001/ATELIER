export * from './database'

import type { ReactNode } from 'react'

export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

export interface SEOProps {
  title?: string | null
  description?: string | null
  image?: string | null
  slug?: string | null
  type?: string | null
  canonicalUrl?: string | null
  keywords?: string | null
  robotsIndex?: boolean | null
  robotsFollow?: boolean | null
  robotsNoarchive?: boolean | null
  robotsNosnippet?: boolean | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  twitterCard?: string | null
  jsonLd?: Record<string, unknown> | null
}
