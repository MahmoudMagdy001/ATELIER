import { supabase } from '../../../lib/supabase'
import { productService } from '../../products/services/productService'
import { offerService } from '../../offers/services/offerService'
import { blogService } from '../../blog/services/blogService'
import { adminService } from '../../admin/services/adminService'

export const homeService = {
  async fetchHomeData() {
    try {
      const [productsRes, offersRes, postsRes, categoriesRes, settingsRes] = await Promise.allSettled([
        productService.fetchPublishedProducts(),
        offerService.fetchPublishedOffers(),
        blogService.fetchPublishedPosts(),
        adminService.fetchCategories('products'),
        adminService.fetchSettings(),
      ])

      const products = productsRes.status === 'fulfilled' ? productsRes.value : []
      const offers = offersRes.status === 'fulfilled' ? offersRes.value : []
      const posts = postsRes.status === 'fulfilled' ? postsRes.value : []
      const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value : []
      const settings = settingsRes.status === 'fulfilled' ? settingsRes.value : {}

      return {
        products,
        offers,
        posts,
        categories,
        settings,
      }
    } catch (err) {
      console.warn('Failed to load home data from Supabase:', err.message)
      return {
        products: [],
        offers: [],
        posts: [],
        categories: [],
        settings: {},
      }
    }
  },
}

export default homeService
