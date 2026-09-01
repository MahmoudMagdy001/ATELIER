-- =========================================================================
-- ATELIER - LUXURY BESPOKE FURNITURE REALISTIC SEED DATA
-- تشغيل هذا الكود في Supabase SQL Editor لملء الموقع ببيانات واقعية وفخمة
-- =========================================================================

-- 1. إعدادات الموقع الأساسية (Site Settings)
INSERT INTO public.site_settings (
  id,
  site_name,
  site_description,
  default_meta_title,
  default_meta_description,
  default_robots,
  default_og_image
)
VALUES (
  1,
  'أتيليه | دار الأثاث الفاخر والتصميم المعماري',
  'دار أثاث فاخر متخصصة في ابتكار وتصنيع القطع الحصرية للقصور والفيلات العصرية بالطلب بأيدي كبار الحرفيين الإيطاليين من أجود أنواع خشب الجوز والرخام الطبيعي.',
  'ATELIER | صياغة الأثاث الفاخر والتصميم الداخلي للقصور',
  'استكشف أرقى تشكيلات الأثاث الإيطالي المصنوع بالطلب من الصالونات وغرف الطعام والمجالس الملكية المصممة خصيصاً لمساحتك.',
  'index, follow',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85'
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_description = EXCLUDED.site_description,
  default_meta_title = EXCLUDED.default_meta_title,
  default_meta_description = EXCLUDED.default_meta_description,
  default_og_image = EXCLUDED.default_og_image;

-- 2. التصنيفات الفاخرة للأثاث والمقالات (Categories)
INSERT INTO public.categories (id, name, slug, description, image_url, type, display_order)
VALUES
  ('c1111111-1111-4111-8111-111111111111', 'الصالونات والمجالس الملكية', 'living-room-majlis', 'أطقم صالونات ومجالس فاخرة مكسوة بأفخم الأقمشة الإيطالية والجلد الطبيعي', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85', 'products', 1),
  ('c2222222-2222-4222-8222-222222222222', 'غرف الطعام وطاولات الرخام', 'dining-rooms', 'طاولات طعام استثنائية من الرخام الإيطالي النادر وقواعد البرونز والنحاس المعتق', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85', 'products', 2),
  ('c3333333-3333-4333-8333-333333333333', 'أجنحة النوم الرئيسية', 'master-bedrooms', 'أسرّة وخزائن فاخرة مصنوعة بالطلب بتفاصيل معمارية راقية وتشطيبات متقنة', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85', 'products', 3),
  ('c4444444-4444-4444-8444-444444444444', 'المكاتب والمكتبات التنفيذية', 'executive-offices', 'أثاث مكاتب تنفيذية للقصور والشركات من خشب الجوز المعتق والجلد الإيطالي', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85', 'products', 4),
  ('c5555555-5555-4555-8555-555555555555', 'فلسفة التصميم والعمارة', 'design-philosophy', 'مقالات متخصصة في فلسفة التأثيث المعماري وتنسيق المساحات الفارهة', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', 'blog', 1),
  ('c6666666-6666-4666-8666-666666666666', 'أسرار الحرفية والخامات', 'craftsmanship-materials', 'دراسات متعمقة حول الأخشاب النادرة والرخام الإيطالي وفنون التشطيب اليدوي', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', 'blog', 2)
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;

-- 3. المنتجات والقطع المصممة بالطلب (Products)
INSERT INTO public.products (
  id,
  title,
  slug,
  description,
  main_image,
  badge,
  category_id,
  status,
  display_order,
  variants,
  meta_title,
  meta_description,
  keywords,
  robots_index,
  robots_follow
)
VALUES
  (
    'a1111111-1111-4111-8111-111111111111',
    'صالون فيرونا المعماري من خشب الجوز الإيطالي',
    'verona-architectural-lounge-set',
    'طقم صالون أيقوني يجمع بين البساطة المعمارية المترفة والراحة المطلقة. مصنع يدوياً من خشب الجوز الإيطالي الصلب ومكسو بقماش البوكليه العاجي الفاخر المعالج ضد البقع، مع وسائد بحشوة ريش النعام الطبيعي.',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85',
    'الأكثر طلباً',
    'c1111111-1111-4111-8111-111111111111',
    'published',
    1,
    '[
      {
        "id": "v1-1",
        "name": "طقم صالون متكامل (كنبة ثلاثية + كنبتين مفردتين + طاولة وسط)",
        "price": 38500,
        "sku": "ATL-VRN-FULL",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "v1-2",
        "name": "كنبة ثلاثية رئيسية (عرض 260 سم)",
        "price": 22000,
        "sku": "ATL-VRN-S3",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "v1-3",
        "name": "كرسي صالون مفرد بذراعين مع قاعدة دوارة مخفية",
        "price": 9500,
        "sku": "ATL-VRN-ARM",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85"
      }
    ]'::jsonb,
    'صالون فيرونا المعماري الإيطالي الفاخر | ATELIER',
    'اقتنِ صالون فيرونا الإيطالي المصنوع يدوياً من خشب الجوز الصلب وقماش البوكليه العاجي بأعلى معايير الفخامة للقصور.',
    'صالون إيطالي, أثاث قصور, كنب فاخر, خشب جوز, أثاث مودرن بالطلب',
    true,
    true
  ),
  (
    'a2222222-2222-4222-8222-222222222222',
    'طاولة طعام كالكاتا أورو الملكية مع قاعدة برونزية',
    'calacatta-oro-luxury-dining-table',
    'طاولة طعام استثنائية بسطح من لوح رخام كالكاتا أورو الإيطالي النادر بسماكة 30 ملم مع حواف مصقولة يدوياً. ترتكز على قاعدة نحتية مكسوة بالبرونز المعتق المقاوم للبصمات والتآكل.',
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
    'إصدار محدود',
    'c2222222-2222-4222-8222-222222222222',
    'published',
    2,
    '[
      {
        "id": "v2-1",
        "name": "طاولة طعام 10 أشخاص (300 × 120 سم) + 10 كراسي مكسوة جلد نابا",
        "price": 54000,
        "sku": "ATL-DNG-CAL-10",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "v2-2",
        "name": "طاولة طعام 8 أشخاص (240 × 110 سم) + 8 كراسي مكسوة مخمل",
        "price": 42000,
        "sku": "ATL-DNG-CAL-8",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "v2-3",
        "name": "طاولة الطعام الرخامية فقط بدون كراسي (300 سم)",
        "price": 31000,
        "sku": "ATL-DNG-CAL-TBL",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85"
      }
    ]'::jsonb,
    'طاولة طعام كالكاتا أورو من الرخام الإيطالي والبرونز | ATELIER',
    'طاولة طعام ملكية مخصصة للقصور من رخام كالكاتا أورو الطبيعي وقواعد البرونز المعتق بتشطيب إيطالي لا يضاهى.',
    'طاولة طعام رخام, رخام كالكاتا, سفرة مودرن, طاولات قصور فاخرة',
    true,
    true
  ),
  (
    'a3333333-3333-4333-8333-333333333333',
    'جناح النوم الملكي أوريليا المنجد بالمخمل الزمردي',
    'aurelia-master-bedroom-suite',
    'جناح نوم متكامل يفيض بالسكينة والرفاهية المطلقة. يتميز بلوح رأسي ممتد بارتفاع 280 سم بتنجيد هندسي يدوي من المخمل الإيطالي الناعم، مع طاولات جانبية مدمجة بأرفف رخامية وإنارة خافتة.',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
    'تصميم حصري',
    'c3333333-3333-4333-8333-333333333333',
    'published',
    3,
    '[
      {
        "id": "v3-1",
        "name": "جناح متكامل (سرير كينج 200×200 + كمدينتين رخام + تسريحة ومقعد + بنش أمامي)",
        "price": 46500,
        "sku": "ATL-BED-AUR-FULL",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "v3-2",
        "name": "السرير الرئيسي واللوح المنجد مع الكمدينتين فقط",
        "price": 31500,
        "sku": "ATL-BED-AUR-SET",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=85"
      }
    ]'::jsonb,
    'جناح النوم الملكي أوريليا بالمخمل الإيطالي | ATELIER',
    'غرفة نوم رئيسية مصممة بالطلب بأرقى أنواع المخمل والرخام وخشب السنديان مع حلول إنارة ذكية مدمجة.',
    'غرفة نوم ملكية, سرير منجد, أثاث غرف نوم, جناح نوم ماستر',
    true,
    true
  ),
  (
    'a4444444-4444-4444-8444-444444444444',
    'المكتب التنفيذي بلاتينيوم مع تطعيمات الجلد الفاخر',
    'platinum-executive-desk-suite',
    'مكتب تنفيذي مهيب مصمم للشخصيات القيادية وأصحاب القصور. سطح المكتب مكسو بجلد التوب غراين الإيطالي ومطعم بأشرطة من التيتانيوم المذهب، ومزود بوحدات تخزين ذكية وأنظمة شحن لاسلكية مخفية.',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
    'للقيادات والقصور',
    'c4444444-4444-4444-8444-444444444444',
    'published',
    4,
    '[
      {
        "id": "v4-1",
        "name": "مكتب قياسي كبير (280 × 110 سم) + خزانة خلفية جدارية + كرسي رئيسي مريح",
        "price": 49000,
        "sku": "ATL-OFF-PLT-FULL",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "v4-2",
        "name": "المكتب التنفيذي فقط مع ملحق التخزين الجانبي",
        "price": 32000,
        "sku": "ATL-OFF-PLT-DSK",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85"
      }
    ]'::jsonb,
    'المكتب التنفيذي بلاتينيوم الفاخر للقصور | ATELIER',
    'مكتب رئاسي تنفيذي مصنوع من خشب الأبنوس والجلد الإيطالي بأنظمة ذكية مخفية للشخصيات المرموقة.',
    'مكتب تنفيذي, مكتب فاخر, أثاث مكاتب قصور, مكتب جلد وجوز',
    true,
    true
  ),
  (
    'a5555555-5555-4555-8555-555555555555',
    'كرسي استرخاء ميلانو المعماري مع مسند قدمين',
    'milano-architectural-lounge-chair',
    'قطعة فنية تجسد قمة الراحة والحداثة الإيطالية. هيكل انسيابي من الخشب المنحني مع بطانة فائقة الكثافة وكسوة من جلد النيلين الطبيعي المدبوغ في توسكانا.',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85',
    'أيقونة التصميم',
    'c1111111-1111-4111-8111-111111111111',
    'published',
    5,
    '[
      {
        "id": "v5-1",
        "name": "كرسي استرخاء + مسند قدمين عثماني (جلد طبيعي بلون الهافان)",
        "price": 16500,
        "sku": "ATL-CHR-MIL-TAN",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "v5-2",
        "name": "كرسي استرخاء + مسند قدمين (قماش كشمير بلون الفحم)",
        "price": 14000,
        "sku": "ATL-CHR-MIL-CSH",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1580481077197-25e243916960?auto=format&fit=crop&w=1200&q=85"
      }
    ]'::jsonb,
    'كرسي ميلانو المعماري الفاخر | ATELIER',
    'كرسي لاونج إيطالي مخصص مع مسند قدمين بتصميم مريح وأنيق من الجلد الطبيعي المدبوغ يدوياً.',
    'كرسي لاونج, كرسي استرخاء, كرسي جلد فاخر, أثاث مودرن',
    true,
    true
  ),
  (
    'a6666666-6666-4666-8666-666666666666',
    'طاولة قهوة ثنائية من الرخام الأسود الماركينا والخشب المشوي',
    'nero-marquina-coffee-table-duo',
    'طقم طاولات قهوة متداخلة بارتفاعين مختلفين. الأولى بسطح من رخام نيرو ماركينا الإسباني الأسود مع عروق بيضاء نقية، والثانية من خشب البلوط المشوي بقاعدة من الستانلس ستيل المذهب.',
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85',
    'جديد المعرض',
    'c1111111-1111-4111-8111-111111111111',
    'published',
    6,
    '[
      {
        "id": "v6-1",
        "name": "طقم طاولتين قهوة متداخلتين (قطر 100 سم + قطر 70 سم)",
        "price": 12500,
        "sku": "ATL-TBL-NERO-SET",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "v6-2",
        "name": "طاولة الرخام الأسود الكبيرة فقط (قطر 100 سم)",
        "price": 7800,
        "sku": "ATL-TBL-NERO-SGL",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85"
      }
    ]'::jsonb,
    'طقم طاولات قهوة رخام أسود نيرو ماركينا وخشب | ATELIER',
    'طاولات قهوة متداخلة للصالونات الفارهة تجمع بين رخام نيرو ماركينا وخشب البلوط المعتق بتصميم نحتي مميز.',
    'طاولة قهوة رخام, طاولات شاي مودرن, رخام أسود, أثاث صالون',
    true,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. العروض والباقات الحصرية (Offers)
INSERT INTO public.offers (
  id,
  title,
  slug,
  description,
  discount_label,
  cover_image,
  valid_from,
  valid_until,
  badge,
  status,
  product_id,
  variants,
  meta_title,
  meta_description,
  keywords,
  robots_index,
  robots_follow
)
VALUES
  (
    'e1111111-1111-4111-8111-111111111111',
    'باقة القصر المتكاملة: صالون فيرونا مع غرفة طعام كالكاتا الملكية',
    'villa-royal-package-verona-calacatta',
    'باقة تأثيث استثنائية متكاملة للمساحات المفتوحة في الفيلات والقصور. تشمل طقم صالون فيرونا الإيطالي الكامل مع طاولة طعام كالكاتا أورو الرخامية لـ 8 أشخاص مع استشارة تصميم مجانية وزيارة ميدانية لرفع القياسات واختيار الأقمشة.',
    'وفر 18,500 ر.س',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '60 days',
    'عرض الموسم الحصري',
    'published',
    'a1111111-1111-4111-8111-111111111111',
    '[
      {
        "id": "ov1-1",
        "name": "الباقة الملكية الكاملة (صالون فيرونا + سفرة كالكاتا 8 كراسي + طاولات شاي إضافية)",
        "price": 68000,
        "original_price": 86500,
        "sku": "ATL-PKG-ROYAL-01",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
      },
      {
        "id": "ov1-2",
        "name": "الباقة الأساسية (صالون فيرونا + سفرة كالكاتا بدون طاولات الشاي)",
        "price": 59000,
        "original_price": 73000,
        "sku": "ATL-PKG-ROYAL-02",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
      }
    ]'::jsonb,
    'باقة القصر المتكاملة للأثاث الإيطالي الفاخر | ATELIER Offers',
    'احصل على باقة القصر المتكاملة التي تجمع بين صالون فيرونا وسفرة كالكاتا الرخامية مع توفير حصري وتفصيل كامل بالطلب.',
    'باقات أثاث, عروض أثاث فلل, أثاث إيطالي مخفض, تخفيضات أثاث فاخر',
    true,
    true
  ),
  (
    'e2222222-2222-4222-8222-222222222222',
    'عرض جناح النوم الفاخر مع غرفة الملابس المصممة بالطلب',
    'master-suite-custom-wardrobe-bundle',
    'باقة متكاملة لغرف النوم الرئيسية تشمل سرير أوريليا المخملي الملكي مع كمدينتين ورخام مدمج بالإضافة إلى تفصيل خزانة ملابس زجاجية مفتوحة (Walk-in Closet) مع إنارة مخفية وتقسيمات إيطالية ذكية.',
    'خصم 20% لفترة محدودة',
    'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=85',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '45 days',
    'باقة خاصة',
    'published',
    'a3333333-3333-4333-8333-333333333333',
    '[
      {
        "id": "ov2-1",
        "name": "جناح النوم الملكي + دولاب ملابس زجاجي تفصيل حتى 4 أمتار",
        "price": 52000,
        "original_price": 65000,
        "sku": "ATL-PKG-BED-WDB",
        "in_stock": true,
        "image": "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=85"
      }
    ]'::jsonb,
    'عرض جناح النوم الماستر مع خزانة الملابس المخصصة | ATELIER',
    'استفد من عرض تفصيل جناح النوم الماستر وخزانة الملابس الإيطالية الفاخرة المضيئة بخصم 20%.',
    'عرض غرفة نوم, خزانة ملابس زجاجية, غرف نوم ماستر, دولاب تفصيل',
    true,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- 5. مقالات المجلة المعمارية (Blog Posts)
INSERT INTO public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  cover_image,
  author,
  tags,
  status,
  published_at,
  category_id,
  reading_time,
  word_count,
  meta_title,
  meta_description,
  keywords,
  robots_index,
  robots_follow
)
VALUES
  (
    'b1111111-1111-4111-8111-111111111111',
    'فلسفة الأثاث المعماري: كيف تحول القطع المصممة بالطلب الفراغ إلى تجربة شعورية؟',
    'philosophy-of-architectural-bespoke-furniture',
    'دراسة معمارية تستعرض أهمية التناغم بين الكتلة والفراغ، وكيف يمنح الأثاث المصنوع خصيصاً للمساحة طابعاً أبدياً يتجاوز حدود الزمن.',
    '<h2>العمارة تبدأ من الفراغ وتكتمل بالقطع الحية</h2><p>في العمارة المعاصرة، لم يعد الأثاث مجرد عناصر إضافية تملأ الفراغات بعد اكتمال البناء، بل أصبح امتداداً عضوياً للخطوط الهندسية التي رسمها المعماري. إن فلسفة <strong>الأثاث المصنوع بالطلب (Bespoke Furniture)</strong> ترتكز على مبدأ جوهري: كل منزل أو قصر يمتلك ضوءاً مختلفاً، وزوايا فريدة، وطاقة خاصة لا يمكن لأي أثاث جاهز أن يترجمها بدقة.</p><h3>خشب الجوز والرخام: حوار الطبيعة الصامت</h3><p>عندما ندمج دفء خشب الجوز الإيطالي الصلب مع برودة وعروق رخام كالكاتا أو نيرو ماركينا، فإننا نخلق توازناً بصرياً ولمسياً يعزز الإحساس بالسكينة والفخامة الهادئة (Quiet Luxury).</p><blockquote>الأثاث الحقيقي لا يصرخ لجذب الانتباه، بل يفرض هيبته بنقاء تفاصيله ودقة تناسبه مع محيطه.</blockquote>',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    'م. باولو روسي - كبير مصممي أتيليه',
    ARRAY['العمارة المعاصرة', 'الأثاث الفاخر', 'التصميم الداخلي', 'خشب الجوز'],
    'published',
    NOW(),
    'c5555555-5555-4555-8555-555555555555',
    5,
    650,
    'فلسفة الأثاث المعماري وتصميم القصور | مجلة ATELIER',
    'اكتشف كيف يساهم الأثاث المصنوع بالطلب في إبراز الفخامة الهادئة وتنسيق المساحات المعمارية الراقية.',
    'عمارة داخلية, أثاث معماري, تصميم قصور, ديكور فلل فخمة',
    true,
    true
  ),
  (
    'b2222222-2222-4222-8222-222222222222',
    'دليل اقتناء الرخام الإيطالي النادر: أسرار عروق كالكاتا وستاتوريو في طاولات القصور',
    'guide-to-rare-italian-marble-calacatta-statuario',
    'دليلك الشامل للتعرف على أندر أنواع الرخام الإيطالي المستخرج من جبال كرارا، وطرق العناية به وحمايته ليظل متألقاً عبر الأجيال.',
    '<h2>لماذا يُعتبر رخام كرارا وكالكاتا الخيار الأول لصفوة المصممين؟</h2><p>على مدار قرون من الزمان، شكّل الرخام الإيطالي المستخرج من جبال توسكانا رمزاً للخلود والجمال المعماري. في صياغة طاولات الطعام الفاخرة، يتم اختيار الألواح التي تتبع نظام (Bookmatch) حيث تلتقي عروق الرخام كصفحات كتاب مفتوح مشكّلة لوحة طبيعية فريدة لن تتكرر في أي قطعة أخرى بالعالم.</p><h3>أنواع الرخام الأكثر طلباً في قصور الخليج:</h3><ul><li><strong>كالكاتا أورو (Calacatta Oro):</strong> يتميز بخلفيته الحليبية وعروقه الذهبية والرمادية الدافئة.</li><li><strong>ستاتوريو (Statuario):</strong> أنقى درجات البياض مع عروق رمادية جريئة ودرامية.</li><li><strong>نيرو ماركينا (Nero Marquina):</strong> السحر الأسود الحالك مع عروق بيضاء كخيوط البرق.</li></ul>',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    'فريق الحرفية والبحث - ATELIER',
    ARRAY['الرخام الإيطالي', 'طاولات طعام', 'الحرفية الإيطالية', 'مواد فاخرة'],
    'published',
    NOW(),
    'c6666666-6666-4666-8666-666666666666',
    4,
    520,
    'دليل أنواع الرخام الإيطالي الفاخر لطاولات الطعام | ATELIER',
    'تعرف على الفرق بين رخام كالكاتا وستاتوريو وكيفية اختيار الرخام الإيطالي النادر لأثاث قصرك.',
    'رخام إيطالي, كالكاتا أورو, رخام ستاتوريو, طاولات رخام طبيعي',
    true,
    true
  )
ON CONFLICT (slug) DO NOTHING;
