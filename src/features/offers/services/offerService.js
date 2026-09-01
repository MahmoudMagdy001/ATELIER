import { supabase } from '../../../lib/supabase'
import { compressImage, deleteStorageFileByUrl } from '../../../lib/imageCompressor'

const INITIAL_OFFERS = [
  {
    id: 'off-1',
    title: 'عرض الصالونات الإيطالية VIP (خصم 20%)',
    slug: 'vip-italian-salons-exclusive-offer',
    description: 'خصم استثنائي لفترة محدودة على صالونات Milano Velvet مع شحن وتركيب مجاني واستشارة تصميم 3D مخصصة لفيلا العميل.',
    cover_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    discount_label: 'خصم 20% + تصميم 3D',
    valid_until: '2026-12-31',
    badge: 'عرض الصيف الحصري',
    status: 'published',
    product_id: 'prod-1',
    variants: [
      {
        id: 'off-var-1',
        name: 'أزرق كحلي ملكي (3 مقاعد - 240 سم)',
        price: 14800,
        original_price: 18500,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        sku: 'OFF-MILANO-NVY',
        in_stock: true
      },
      {
        id: 'off-var-2',
        name: 'بيج عاجي ناعم (3 مقاعد - 240 سم)',
        price: 14800,
        original_price: 18500,
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        sku: 'OFF-MILANO-BGE',
        in_stock: true
      },
      {
        id: 'off-var-3',
        name: 'طقم كامل VIP (كنبة كبيرة + 2 كرسي فوتيه)',
        price: 23840,
        original_price: 29800,
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        sku: 'OFF-MILANO-VIP',
        in_stock: true
      }
    ],
    meta_title: 'عرض صالونات Milano Velvet الإيطالية الفاخرة | ATELIER',
    meta_description: 'احصل على خصم 20% على تشكيلة الصالونات الإيطالية الفاخرة مع تركيب مجاني.',
    keywords: 'عروض أثاث, خصم صالونات, أثاث إيطالي مخفض'
  },
  {
    id: 'off-2',
    title: 'باقة طاولة طعام Nero Marquina + 8 كراسي مجانية',
    slug: 'nero-marquina-dining-set-package-offer',
    description: 'اشتري طاولة الطعام الرخامية الإسبانية واحصل على باقة كراسي طعام جلدية مجاناً مع ضمان 10 سنوات.',
    cover_image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
    discount_label: 'باقة 8 كراسي مجانية',
    valid_until: '2026-11-30',
    badge: 'باقة تأثيث كاملة',
    status: 'published',
    product_id: 'prod-2',
    variants: [
      {
        id: 'off-var-4',
        name: 'رخام أسود ماركينا (8 مقاعد - 220×110 سم) + 8 كراسي',
        price: 24000,
        original_price: 31000,
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        sku: 'OFF-NERO-8S',
        in_stock: true
      },
      {
        id: 'off-var-5',
        name: 'رخام كالكاتا أبيض ذهبي (10 مقاعد - 280×120 سم) + 10 كراسي',
        price: 32500,
        original_price: 41500,
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        sku: 'OFF-CALACATTA-10S',
        in_stock: true
      }
    ],
    meta_title: 'عرض باقة طاولات الطعام الرخامية الفاخرة | ATELIER',
    meta_description: 'عرض خاص على طاولات الطعام الرخامية الإسبانية والإيطالية.',
    keywords: 'عروض طاولات طعام, رخام ماركينا, أثاث مخفض'
  }
]

function getLocalOffers() {
  try {
    const item = localStorage.getItem('atelier_offers')
    return item ? JSON.parse(item) : INITIAL_OFFERS
  } catch {
    return INITIAL_OFFERS
  }
}

function saveLocalOffers(data) {
  try {
    localStorage.setItem('atelier_offers', JSON.stringify(data))
  } catch {}
}

export const offerService = {
  async fetchPublishedOffers() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('status', 'published')
        .gte('valid_until', today)
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) return data
    } catch (e) {}
    return getLocalOffers().filter(o => o.status === 'published')
  },

  async fetchOfferBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('slug', slug)
        .single()
      if (!error && data) return data
    } catch (e) {}
    const local = getLocalOffers().find(o => o.slug === slug)
    if (local) return local
    throw new Error('العرض غير متوفر')
  },

  async fetchAllOffers() {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) return data
    } catch (e) {}
    return getLocalOffers()
  },

  async deleteOffer(id) {
    try {
      const { data: offer } = await supabase
        .from('offers')
        .select('cover_image, variants')
        .eq('id', id)
        .single()

      await supabase.from('offers').delete().eq('id', id)

      if (offer?.cover_image) {
        await deleteStorageFileByUrl(offer.cover_image, 'offer-covers')
      }
      if (Array.isArray(offer?.variants)) {
        for (const v of offer.variants) {
          if (v.image) await deleteStorageFileByUrl(v.image, 'offer-covers')
        }
      }
    } catch (e) {}

    const local = getLocalOffers().filter(o => o.id !== id)
    saveLocalOffers(local)
  },

  async uploadImage(file) {
    const compressedFile = await compressImage(file)
    const fileExt = compressedFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `offers/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('offer-covers')
        .upload(filePath, compressedFile)

      if (!uploadError) {
        const { data } = supabase.storage.from('offer-covers').getPublicUrl(filePath)
        return data.publicUrl
      }
    } catch (e) {}

    return URL.createObjectURL(file)
  },

  async updateOffer(id, offerData) {
    try {
      const { error } = await supabase
        .from('offers')
        .update(offerData)
        .eq('id', id)
      if (!error) {
        const local = getLocalOffers().map(o => o.id === id ? { ...o, ...offerData } : o)
        saveLocalOffers(local)
        return
      }
    } catch (e) {}

    const local = getLocalOffers().map(o => o.id === id ? { ...o, ...offerData } : o)
    saveLocalOffers(local)
  },

  async insertOffer(offerData) {
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert([offerData])
        .select()
        .single()
      if (!error && data) {
        const local = [data, ...getLocalOffers()]
        saveLocalOffers(local)
        return data
      }
    } catch (e) {}

    const newItem = { id: `off-${Date.now()}`, ...offerData }
    const local = [newItem, ...getLocalOffers()]
    saveLocalOffers(local)
    return newItem
  }
}

export default offerService
