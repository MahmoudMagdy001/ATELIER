import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'طقم صالون Milano Velvet الملكي',
    slug: 'milano-velvet-royal-living-set',
    description: 'طقم صالون فاخر مصمم خصيصاً للقصور والفيلات، هيكل من خشب الزان المعتق، مكسو بمخمل إيطالي ناعم مقاوم للبقع مع تطعيمات برونزية.',
    main_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    badge: 'الأكثر طلباً',
    status: 'published',
    display_order: 1,
    variants: [
      {
        id: 'var-1',
        name: 'أزرق كحلي ملكي (3 مقاعد - 240 سم)',
        price: 18500,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        sku: 'MILANO-NVY-240',
        in_stock: true
      },
      {
        id: 'var-2',
        name: 'بيج عاجي ناعم (3 مقاعد - 240 سم)',
        price: 18500,
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        sku: 'MILANO-BGE-240',
        in_stock: true
      },
      {
        id: 'var-3',
        name: 'طقم كامل VIP (كنبة كبيرة + 2 كرسي فوتيه)',
        price: 29800,
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        sku: 'MILANO-SET-VIP',
        in_stock: true
      }
    ],
    meta_title: 'طقم صالون Milano Velvet الملكي | ATELIER',
    meta_description: 'صالون إيطالي فاخر مخملي بتصميم معاصر وجودة استثنائية للقصور.',
    keywords: 'أثاث فاخر, صالون إيطالي, كنب مخمل, أتيليه'
  },
  {
    id: 'prod-2',
    title: 'طاولة طعام Nero Marquina الرخامية',
    slug: 'nero-marquina-luxury-dining-table',
    description: 'طاولة طعام رخامية من حجر نيرو ماركينا الإسباني الطبيعي مع قاعدة هندسية من الفولاذ المطلي بالذهب غير اللامع.',
    main_image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
    badge: 'Bespoke Edition',
    status: 'published',
    display_order: 2,
    variants: [
      {
        id: 'var-4',
        name: 'رخام أسود ماركينا (8 مقاعد - 220×110 سم)',
        price: 24000,
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        sku: 'NERO-8S-220',
        in_stock: true
      },
      {
        id: 'var-5',
        name: 'رخام كالكاتا أبيض ذهبي (10 مقاعد - 280×120 سم)',
        price: 32500,
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        sku: 'CALACATTA-10S-280',
        in_stock: true
      }
    ],
    meta_title: 'طاولة طعام Nero Marquina الرخامية الفاخرة',
    meta_description: 'طاولة طعام رخام طبيعي إسباني بتصميم معماري حصري.',
    keywords: 'طاولة طعام رخام, أثاث قصور, تصميم إيطالي'
  },
  {
    id: 'prod-3',
    title: 'كرسي لاونج Bellagio الجلد الإيطالي',
    slug: 'bellagio-italian-leather-lounge-chair',
    description: 'كرسي استرخاء مصنوع من جلد التوب غرين الإيطالي الفاخر مع حشوة ريش النعام وقاعدة دوارة من التيتانيوم المصقول.',
    main_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    badge: 'تصميم إيطالي',
    status: 'published',
    display_order: 3,
    variants: [
      {
        id: 'var-6',
        name: 'جلد كونياك بني كلاسيكي (Cognac Leather)',
        price: 8900,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        sku: 'BELLAGIO-BRN',
        in_stock: true
      },
      {
        id: 'var-7',
        name: 'جلد أسود فحمي مع خشب الجوز (Charcoal & Walnut)',
        price: 9600,
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
        sku: 'BELLAGIO-BLK-WNT',
        in_stock: true
      }
    ],
    meta_title: 'كرسي لاونج Bellagio الجلد الإيطالي | ATELIER',
    meta_description: 'كرسي استرخاء فاخر من الجلد الطبيعي لتصميم غرف المعيشة والمكاتب الراقية.',
    keywords: 'كرسي جلد, كرسي لاونج, أثاث إيطالي فاخر'
  }
]

function getLocalProducts() {
  try {
    const item = localStorage.getItem('atelier_products')
    return item ? JSON.parse(item) : INITIAL_PRODUCTS
  } catch {
    return INITIAL_PRODUCTS
  }
}

function saveLocalProducts(data) {
  try {
    localStorage.setItem('atelier_products', JSON.stringify(data))
  } catch {}
}

export const productService = {
  async fetchPublishedProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true })
      if (!error && data && data.length > 0) return data
    } catch (e) {}
    return getLocalProducts().filter(p => p.status === 'published')
  },

  async fetchProductBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()
      if (!error && data) return data
    } catch (e) {}
    const local = getLocalProducts().find(p => p.slug === slug)
    if (local) return local
    throw new Error('المنتج غير موجود')
  },

  async fetchAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true })
      if (!error && data && data.length > 0) return data
    } catch (e) {}
    return getLocalProducts()
  },

  async deleteProduct(id) {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('main_image, variants')
        .eq('id', id)
        .single()

      await supabase.from('products').delete().eq('id', id)

      if (product?.main_image) {
        await deleteStorageFileByUrl(product.main_image, 'product-images')
      }
      if (Array.isArray(product?.variants)) {
        for (const v of product.variants) {
          if (v.image) await deleteStorageFileByUrl(v.image, 'product-images')
        }
      }
    } catch (e) {}

    const local = getLocalProducts().filter(p => p.id !== id)
    saveLocalProducts(local)
  },

  async uploadImage(file) {
    const compressedFile = await compressImage(file)
    const fileExt = compressedFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile)

      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
        return data.publicUrl
      }
    } catch (e) {}

    // Fallback: local blob url for preview
    return URL.createObjectURL(file)
  },

  async updateProduct(id, productData) {
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
      if (!error) {
        const local = getLocalProducts().map(p => p.id === id ? { ...p, ...productData } : p)
        saveLocalProducts(local)
        return
      }
    } catch (e) {}

    const local = getLocalProducts().map(p => p.id === id ? { ...p, ...productData } : p)
    saveLocalProducts(local)
  },

  async insertProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()
      if (!error && data) {
        const local = [data, ...getLocalProducts()]
        saveLocalProducts(local)
        return data
      }
    } catch (e) {}

    const newItem = { id: `prod-${Date.now()}`, ...productData }
    const local = [newItem, ...getLocalProducts()]
    saveLocalProducts(local)
    return newItem
  }
}

export default productService
