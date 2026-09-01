import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'فن تشكيل المساحات الفاخرة: الاتجاهات المعمارية لعام 2026',
    slug: 'art-of-luxury-spaces-2026',
    excerpt: 'استكشاف لغة التصميم المعماري الحديث والدمج بين خشب الجوز الإيطالي والرخام الطبيعي النادر في الفيلات الراقية.',
    content: '<p>يعكس التصميم الداخلي الفاخر المعاصر روح التفرد والاهتمام بأدق التفاصيل الحرفية. في اتيليه، نؤمن بأن كل قطعة أثاث يجب أن تروي قصة خالدة من الأناقة والتوازن البصري.</p><h2>1. خامات طبيعية مستدامة وفائقة الفخامة</h2><p>استخدام الخشب المعالج يدوياً مع التطعيمات النحاسية والبرونزية يمنح الفراغات عمقاً ودفئاً استثنائياً.</p>',
    cover_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-1',
    category_name: 'الاتجاهات المعمارية',
    status: 'published',
    meta_title: 'فن تشكيل المساحات الفاخرة 2026 | ATELIER',
    meta_description: 'دليل تصميم الفيلات والقصور الفاخرة باستخدام أرقى الخامات والأثاث المصنوع يدوياً.',
    meta_keywords: 'تصميم داخلي, أثاث فاخر, ديكور قصور, اتيليه',
    views_count: 1420,
    created_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'post-2',
    title: 'الأثاث المصنوع بالطلب (Bespoke): لماذا هو الخيار الأول للقصور؟',
    slug: 'bespoke-luxury-furniture-guide',
    excerpt: 'كيف تحول القطع المصممة خصيصاً بمقاسات ومواد منتقاة منزلك إلى تحفة فنية لا تتكرر.',
    content: '<p>تتميز القطع المصنوعة يدوياً بالتفرد الكامل، حيث يتم اختيار كل لوح خشب وكل ملمس قماش ليتناسب مع شخصية المالك والمساحة المحددة.</p>',
    cover_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-2',
    category_name: 'حرفية الأثاث',
    status: 'published',
    meta_title: 'دليل الأثاث المصنوع بالطلب | ATELIER Luxury',
    meta_description: 'تعرف على معايير تصنيع الأثاث الفاخر بالطلب.',
    meta_keywords: 'أثاث مخصص, Bespoke Furniture, تصميم إيطالي',
    views_count: 980,
    created_at: '2026-08-20T12:30:00Z'
  }
]

const INITIAL_SERVICES = [
  {
    id: 'srv-1',
    title: 'تصنيع الأثاث الفاخر بالطلب (Bespoke Furniture)',
    slug: 'bespoke-furniture-manufacturing',
    description: 'تصميم وتصنيع غرف معيشة، غرف طعام، وخزائن خشبية مدمجة بأرقى المعايير الحرفية العالمية واستيراد مباشر للجلود والأقمشة الإيطالية.',
    hero_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    features: ['أخشاب جوز وسنديان طبيعية معالجة', 'تفصيل مقاسات دقيقة بالسنتيمتر', 'ضمان شامل على الهياكل', 'إشراف كبار المصممين'],
    is_active: true
  },
  {
    id: 'srv-2',
    title: 'التصميم الداخلي الشامل للقصور والفيلات (Full Interior Architecture)',
    slug: 'luxury-interior-architecture',
    description: 'دراسة معمارية وفراغية متكاملة تشمل المخططات التنفيذية، توزيع الإضاءة الذكية، واختيار الخامات والإكسسوارات.',
    hero_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    features: ['مخططات 3D فائقة الواقعية', 'إدارة وتنسيق كامل للتنفيذ', 'استشارات خاصة في الموقع', 'حلول صوتية وإضاءة ذكية'],
    is_active: true
  },
  {
    id: 'srv-3',
    title: 'الكسوات الجدارية والأعمال الخشبية الفاخرة (Wall Paneling & Millwork)',
    slug: 'custom-millwork-paneling',
    description: 'تنفيذ تجاليد خشبية راقية، قواطع برونزية وزجاجية، وأبواب سرية متناغمة مع ديكور الجدران.',
    hero_image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
    features: ['تطعيمات معدنية مذهبة', 'عزل صوتي متطور', 'تشطيبات مطفية ولامعة فاخرة'],
    is_active: true
  }
]

const INITIAL_OFFERS = [
  {
    id: 'off-1',
    title: 'جلسة استشارية حصرية مع كبير المصممين + تصميم 3D مجاني',
    slug: 'exclusive-villa-design-consultation',
    badge: 'Special VIP',
    discount_text: 'استشارة VIP مجانية',
    description: 'عند التعاقد على تأثيث القصور أو الفيلات بمساحات تبدأ من 500م²، احصل على الجلسة الاستشارية ومخططات الـ 3D مجاناً.',
    banner_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    valid_until: '2026-12-31',
    is_active: true
  },
  {
    id: 'off-2',
    title: 'مجموعة الصالون الإيطالي Milano Velvet - إصدار محدود',
    slug: 'milano-velvet-limited-edition',
    badge: 'Limited Edition',
    discount_text: 'خصم 15% للحجز المبكر',
    description: 'طقم صالون فاخر مصنوع من خشب الزان المعتق ومكسو بمخمل إيطالي ناعم مقاوم للبقع مع أرجل من البرونز المصقول.',
    banner_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    valid_until: '2026-10-30',
    is_active: true
  }
]

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'الاتجاهات المعمارية', slug: 'architectural-trends', type: 'blog', count: 4 },
  { id: 'cat-2', name: 'حرفية الأثاث', slug: 'furniture-craftsmanship', type: 'blog', count: 3 },
  { id: 'cat-3', name: 'التصميم المينيمالي الراقي', slug: 'luxury-minimalism', type: 'service_style', count: 5 },
  { id: 'cat-4', name: 'النمط الكلاسيكي الحديث', slug: 'neo-classic', type: 'service_style', count: 7 }
]

const INITIAL_MEDIA = [
  { id: 'med-1', name: 'living-room-onyx.webp', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', size: '1.2 MB', created_at: '2026-08-01' },
  { id: 'med-2', name: 'bespoke-sofa-bronze.webp', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', size: '940 KB', created_at: '2026-08-05' },
  { id: 'med-3', name: 'dining-marble-table.webp', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80', size: '1.8 MB', created_at: '2026-08-12' },
  { id: 'med-4', name: 'villa-architecture.webp', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', size: '2.1 MB', created_at: '2026-08-22' }
]

const INITIAL_REDIRECTS = [
  { id: 'red-1', source: '/old-furniture', destination: '/services/bespoke-furniture-manufacturing', status_code: 301, hit_count: 84, is_active: true },
  { id: 'red-2', source: '/consulting', destination: '/offers/exclusive-villa-design-consultation', status_code: 302, hit_count: 142, is_active: true }
]

const INITIAL_SETTINGS = {
  brand_name_ar: 'أتيليه للأثاث والتصميم الداخلي الفاخر',
  brand_name_en: 'ATELIER Bespoke Luxury Furniture & Interiors',
  brand_slogan: 'Bespoke Luxury, Timeless Elegance',
  contact_phone: '+966 50 123 4567',
  contact_whatsapp: '+966501234567',
  contact_email: 'concierge@atelier-luxury.com',
  showroom_address: 'طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية',
  google_maps_url: 'https://maps.google.com',
  social_instagram: 'https://instagram.com/atelier.bespoke',
  social_pinterest: 'https://pinterest.com/atelierluxury',
  social_linkedin: 'https://linkedin.com/company/atelier-interiors',
  meta_title_template: '%s | ATELIER Luxury Furniture',
  meta_default_description: 'أتيليه - علامة رائدة في صناعة الأثاث الفاخر بالطلب والتصميم الداخلي المعماري للقصور والفيلات الراقية.',
  header_scripts: ''
}

function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem('atelier_' + key)
    return item ? JSON.parse(item) : fallback
  } catch (e) {
    return fallback
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem('atelier_' + key, JSON.stringify(val))
  } catch (e) {}
}

export const demoStore = {
  getPosts: () => getStorage('posts', INITIAL_POSTS),
  savePosts: (data) => setStorage('posts', data),

  getServices: () => getStorage('services', INITIAL_SERVICES),
  saveServices: (data) => setStorage('services', data),

  getOffers: () => getStorage('offers', INITIAL_OFFERS),
  saveOffers: (data) => setStorage('offers', data),

  getCategories: () => getStorage('categories', INITIAL_CATEGORIES),
  saveCategories: (data) => setStorage('categories', data),

  getMedia: () => getStorage('media', INITIAL_MEDIA),
  saveMedia: (data) => setStorage('media', data),

  getRedirects: () => getStorage('redirects', INITIAL_REDIRECTS),
  saveRedirects: (data) => setStorage('redirects', data),

  getSettings: () => getStorage('settings', INITIAL_SETTINGS),
  saveSettings: (data) => setStorage('settings', data),

  getAuthUser: () => {
    try {
      const u = localStorage.getItem('atelier_user')
      return u ? JSON.parse(u) : { email: 'admin@atelier-luxury.com', name: 'Atelier Director' }
    } catch {
      return { email: 'admin@atelier-luxury.com', name: 'Atelier Director' }
    }
  },
  signIn: (email, password) => {
    const user = { email: email || 'admin@atelier-luxury.com', name: 'Atelier Director' }
    localStorage.setItem('atelier_user', JSON.stringify(user))
    return { data: { user }, error: null }
  },
  signOut: () => {
    localStorage.removeItem('atelier_user')
    return { error: null }
  }
}
