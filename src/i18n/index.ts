import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Arabic locale namespaces
import arCommon from '../locales/ar/common.json'
import arHome from '../locales/ar/home.json'
import arProducts from '../locales/ar/products.json'
import arBespoke from '../locales/ar/bespoke.json'
import arOffers from '../locales/ar/offers.json'
import arBlog from '../locales/ar/blog.json'
import arContact from '../locales/ar/contact.json'

// English locale namespaces
import enCommon from '../locales/en/common.json'
import enHome from '../locales/en/home.json'
import enProducts from '../locales/en/products.json'
import enBespoke from '../locales/en/bespoke.json'
import enOffers from '../locales/en/offers.json'
import enBlog from '../locales/en/blog.json'
import enContact from '../locales/en/contact.json'

export const resources = {
  ar: {
    common: arCommon,
    home: arHome,
    products: arProducts,
    bespoke: arBespoke,
    offers: arOffers,
    blog: arBlog,
    contact: arContact,
  },
  en: {
    common: enCommon,
    home: enHome,
    products: enProducts,
    bespoke: enBespoke,
    offers: enOffers,
    blog: enBlog,
    contact: enContact,
  },
} as const

export function updateDocumentDirection(language: string) {
  if (typeof document === 'undefined') return
  const isEn = language.startsWith('en')
  const dir = isEn ? 'ltr' : 'rtl'
  const lang = isEn ? 'en' : 'ar'
  
  document.documentElement.dir = dir
  document.documentElement.lang = lang
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    defaultNS: 'common',
    ns: ['common', 'home', 'products', 'bespoke', 'offers', 'blog', 'contact'],
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'atelier_language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

// Keep document root synchronized with i18next language
i18n.on('languageChanged', (lng) => {
  const normalized = lng?.startsWith('en') ? 'en' : 'ar'
  updateDocumentDirection(normalized)
  try {
    localStorage.setItem('atelier_language', normalized)
  } catch {
    // quiet fallback for private browsing mode
  }
})

// Run on initial load
const initialLanguage = i18n.language?.startsWith('en') ? 'en' : 'ar'
updateDocumentDirection(initialLanguage)

export default i18n
