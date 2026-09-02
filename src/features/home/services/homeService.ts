import { productService } from '../../products/services/productService'
import { portfolioService } from '../../portfolio/services/portfolioService'
import { adminService } from '../../admin/services/adminService'
import type { LimitedEdition, PortfolioItem, Category, SiteSettings } from '../../../types/database'

export interface HomeData {
  products: LimitedEdition[]
  portfolio: PortfolioItem[]
  categories: Category[]
  settings: SiteSettings | null
}

export const homeService = {
  async fetchHomeData(): Promise<HomeData> {
    try {
      const [productsRes, portfolioRes, categoriesRes, settingsRes] = await Promise.allSettled([
        productService.fetchPublishedProducts(),
        portfolioService.fetchVisiblePortfolio(),
        adminService.fetchCategories('products'),
        adminService.fetchSettings(),
      ])

      const products = productsRes.status === 'fulfilled' ? productsRes.value : []
      const portfolio = portfolioRes.status === 'fulfilled' ? portfolioRes.value : []
      const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value : []
      const settings = (settingsRes.status === 'fulfilled' ? settingsRes.value : null) || null

      return {
        products,
        portfolio,
        categories,
        settings,
      }
    } catch (err: unknown) {
      console.warn('Failed to load home data from Supabase:', (err as Error)?.message || err)
      return {
        products: [],
        portfolio: [],
        categories: [],
        settings: null,
      }
    }
  },
}

export default homeService
