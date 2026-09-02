import { productService } from '../../products/services/productService'
import { portfolioService } from '../../portfolio/services/portfolioService'
import { adminService } from '../../admin/services/adminService'

export const homeService = {
  async fetchHomeData() {
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
      const settings = settingsRes.status === 'fulfilled' ? settingsRes.value : {}

      return {
        products,
        portfolio,
        categories,
        settings,
      }
    } catch (err) {
      console.warn('Failed to load home data from Supabase:', err.message)
      return {
        products: [],
        portfolio: [],
        categories: [],
        settings: {},
      }
    }
  },
}

export default homeService
