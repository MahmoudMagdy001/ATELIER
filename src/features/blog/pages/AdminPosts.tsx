import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { PageLoading } from '../../../components/ui/Loading'
import { useAdminPosts } from '../hooks/useAdminPosts'
import { FaPen, FaTrash, FaPlus, FaUpload, FaEye, FaFloppyDisk, FaNewspaper } from 'react-icons/fa6'
import SEOSection from '../../../components/admin/SEOSection'
import SEOAnalyzer from '../../../components/admin/SEOAnalyzer'
import ImagePicker from '../../../components/admin/ImagePicker'
import AdminLanguageTabs, { type AdminLocale } from '../../../components/admin/AdminLanguageTabs'
import TipTapEditor from '../components/TipTapEditor'
import DOMPurify from 'dompurify'
import '../../../styles/article.css'

export default function AdminPosts() {
  const [activeLocale, setActiveLocale] = useState<AdminLocale>('ar')
  const {
    posts,
    loading,
    isEditing,
    currentPost,
    title,
    setTitle,
    titleEn,
    setTitleEn,
    slug,
    setSlug,
    excerpt,
    setExcerpt,
    excerptEn,
    setExcerptEn,
    content,
    setContent,
    contentEn,
    setContentEn,
    author,
    setAuthor,
    authorEn,
    setAuthorEn,
    tags,
    setTags,
    status,
    setStatus,
    imageFile,
    setImageFile,
    imageUrl,
    setImageUrl,
    submitting,
    handleEdit,
    handleCreateNew,
    handleDelete,
    handleSubmit,
    setIsEditing,
    categoryId,
    setCategoryId,
    categories,
    metaTitle,
    setMetaTitle,
    metaTitleEn,
    setMetaTitleEn,
    metaDescription,
    setMetaDescription,
    metaDescriptionEn,
    setMetaDescriptionEn,
    keywords,
    setKeywords,
    canonicalUrl,
    setCanonicalUrl,
    robotsIndex,
    setRobotsIndex,
    robotsFollow,
    setRobotsFollow,
    robotsNoarchive,
    setRobotsNoarchive,
    robotsNosnippet,
    setRobotsNosnippet,
    ogTitle,
    setOgTitle,
    ogDescription,
    setOgDescription,
    ogImage,
    setOgImage,
    twitterCard,
    setTwitterCard,
    imageAlt,
    setImageAlt,
    imageTitle,
    setImageTitle,
    caption,
    setCaption,
  } = useAdminPosts()

  const [editorTab, setEditorTab] = useState('edit')
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile)
      setImagePreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setImagePreview(imageUrl || '')
    }
  }, [imageFile, imageUrl])

  if (loading && !isEditing) return <PageLoading text="جار تحميل المقالات..." />

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DC] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141110]">
            {isEditing ? (currentPost ? 'تعديل المقال' : 'إنشاء مقال معماري فاخر') : 'إدارة مقالات المدونة (Posts)'}
          </h1>
          <p className="text-xs text-[#8C7F75] mt-1">نشر وتحرير مقالات العمارة والتصميم الداخلي مع محرر الـ SEO المتقدم</p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreateNew} icon={<FaPlus />}>
            مقال جديد
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Multilingual Tabs */}
          <AdminLanguageTabs
            activeLocale={activeLocale}
            onChange={setActiveLocale}
            hasEnglishContent={Boolean(titleEn || contentEn)}
          />

          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
              <h3 className="font-bold text-base text-[#141110]">
                {activeLocale === 'ar' ? 'البيانات الأساسية للمقال (العربية)' : 'Basic Article Information (English)'}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C7F75] border border-[#E6E1DC]">
                {activeLocale === 'ar' ? '🇸🇦 العربية (الرئيسية)' : '🇬🇧 English (Optional)'}
              </span>
            </div>

            {activeLocale === 'ar' ? (
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5">عنوان المقال (بالعربية) *</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: فن تشكيل المساحات الفاخرة 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5">الكاتب / المصمم (بالعربية)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="فريق تحرير أتيليه"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">مقتطف المقال (Excerpt بالعربية) *</label>
                  <textarea
                    rows={2}
                    required
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    placeholder="مقدمة سريعة تظهر في بطاقة المقال وقوائم التصفح..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4" dir="ltr">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Article Title (English)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Sculpting Timeless Architectural Spaces 2026"
                    />
                    <p className="text-[11px] text-[#8C7F75] mt-1 text-left">Leave blank to use Arabic text as fallback</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Author / Designer (English)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                      value={authorEn}
                      onChange={(e) => setAuthorEn(e.target.value)}
                      placeholder="e.g. S&I Editorial Advisory Team"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5 text-left">Article Excerpt (English)</label>
                  <textarea
                    rows={2}
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all text-left"
                    placeholder="Concise English overview appearing on article preview cards..."
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Shared Article Settings */}
            <div className="pt-4 border-t border-[#E6E1DC] space-y-4">
              <h4 className="text-xs font-bold text-[#8C7F75] uppercase tracking-wider">
                {activeLocale === 'en' ? 'General Article Settings' : 'الإعدادات العامة للمقال (مشتركة)'}
              </h4>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                    {activeLocale === 'en' ? 'Custom URL Slug' : 'الرابط المخصص (Slug)'}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-mono text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    placeholder={activeLocale === 'en' ? 'Leave blank for auto-generation' : 'اتركه فارغاً للتوليد التلقائي'}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                    {activeLocale === 'en' ? 'Category' : 'القسم / التصنيف'}
                  </label>
                  <select
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all cursor-pointer"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">{activeLocale === 'en' ? '-- Select Category --' : '-- اختر التصنيف --'}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {activeLocale === 'en' ? (c.name_en || c.name) : c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                    {activeLocale === 'en' ? 'Tags (comma separated)' : 'الوسوم (مفصولة بفواصل)'}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] placeholder-[#8C7F75] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all"
                    placeholder={activeLocale === 'en' ? 'Interior, Marble, Italian Furniture' : 'ديكور, رخام, أثاث إيطالي'}
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C544E] mb-1.5">
                    {activeLocale === 'en' ? 'Publishing Status' : 'حالة النشر'}
                  </label>
                  <select
                    className="w-full rounded-xl border border-[#E6E1DC] bg-white px-4 py-2.5 text-sm font-medium text-[#141110] focus:border-[#C4A070] focus:ring-1 focus:ring-[#C4A070] focus:outline-none transition-all cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="draft">{activeLocale === 'en' ? 'Draft' : 'مسودة (Draft)'}</option>
                    <option value="published">{activeLocale === 'en' ? 'Published' : 'منشور (Published)'}</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="pt-2">
                <ImagePicker
                  label={activeLocale === 'en' ? 'Featured Cover Image' : 'صورة الغلاف البارزة'}
                  value={imageUrl}
                  onChange={setImageUrl}
                  file={imageFile}
                  onFileChange={setImageFile}
                  hint={activeLocale === 'en' ? 'High quality image shown on article cards and listing pages' : 'صورة عالية الجودة تظهر في بطاقة المقال والواجهة الرئيسية'}
                  title={activeLocale === 'en' ? 'Select cover image from Media Library' : 'اختر صورة للغلاف من مكتبة الوسائط'}
                />
              </div>
            </div>
          </div>

          {/* TipTap Rich Content Editor */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E1DC] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E1DC] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#141110]">
                  {activeLocale === 'ar' ? 'محتوى المقال التفاعلي (بالعربية)' : 'Article Body Content (English)'}
                </h3>
                <p className="text-xs text-[#8C7F75] mt-0.5">
                  {activeLocale === 'ar' ? 'المحتوى الرئيسي الكامل باللغة العربية' : 'Full English article text (Optional fallback to Arabic)'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditorTab('edit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    editorTab === 'edit' ? 'bg-[#C4A070] text-white' : 'bg-[#FAF8F5] text-[#5C544E]'
                  }`}
                >
                  {activeLocale === 'en' ? 'Editor' : 'المحرر'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    editorTab === 'preview' ? 'bg-[#C4A070] text-white' : 'bg-[#FAF8F5] text-[#5C544E]'
                  }`}
                >
                  <FaEye className="w-3 h-3" />
                  <span>{activeLocale === 'en' ? 'Preview' : 'معاينة'}</span>
                </button>
              </div>
            </div>

            {activeLocale === 'ar' ? (
              editorTab === 'edit' ? (
                <TipTapEditor value={content} onChange={setContent} />
              ) : (
                <div
                  className="article-content bg-[#FAF8F5] p-6 rounded-2xl border border-[#E6E1DC] min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                />
              )
            ) : (
              <div dir="ltr">
                {editorTab === 'edit' ? (
                  <TipTapEditor value={contentEn} onChange={setContentEn} />
                ) : (
                  <div
                    className="article-content bg-[#FAF8F5] p-6 rounded-2xl border border-[#E6E1DC] min-h-[400px] text-left"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentEn || content) }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Live SEO Analyzer and SEO Metadata Box */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7">
              <SEOSection
                metaTitle={activeLocale === 'en' ? metaTitleEn : metaTitle}
                setMetaTitle={activeLocale === 'en' ? setMetaTitleEn : setMetaTitle}
                metaDescription={activeLocale === 'en' ? metaDescriptionEn : metaDescription}
                setMetaDescription={activeLocale === 'en' ? setMetaDescriptionEn : setMetaDescription}
                keywords={keywords}
                setKeywords={setKeywords}
                canonicalUrl={canonicalUrl}
                setCanonicalUrl={setCanonicalUrl}
                robotsIndex={robotsIndex}
                setRobotsIndex={setRobotsIndex}
                robotsFollow={robotsFollow}
                setRobotsFollow={setRobotsFollow}
                robotsNoarchive={robotsNoarchive}
                setRobotsNoarchive={setRobotsNoarchive}
                robotsNosnippet={robotsNosnippet}
                setRobotsNosnippet={setRobotsNosnippet}
                ogTitle={ogTitle}
                setOgTitle={setOgTitle}
                ogDescription={ogDescription}
                setOgDescription={setOgDescription}
                ogImage={ogImage}
                setOgImage={setOgImage}
                twitterCard={twitterCard}
                setTwitterCard={setTwitterCard}
                imageAlt={imageAlt}
                setImageAlt={setImageAlt}
                locale={activeLocale}
              />
            </div>

            <div className="lg:col-span-5 sticky top-6">
              <SEOAnalyzer
                title={activeLocale === 'en' ? (titleEn || title) : title}
                description={activeLocale === 'en' ? (metaDescriptionEn || excerptEn || excerpt) : (metaDescription || excerpt)}
                content={activeLocale === 'en' ? (contentEn || content) : content}
                focusKeyword={keywords}
                imageAlt={imageAlt}
                canonicalUrl={canonicalUrl}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#E6E1DC]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl border border-[#E6E1DC] text-xs font-bold text-[#5C544E] hover:bg-[#FAF8F5]"
            >
              {activeLocale === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <Button type="submit" disabled={submitting} icon={<FaFloppyDisk />} size="lg">
              {submitting 
                ? (activeLocale === 'en' ? 'Saving...' : 'جار الحفظ والتحديث...') 
                : (activeLocale === 'en' ? 'Save & Publish Article' : 'حفظ ونشر المقال')}
            </Button>
          </div>
        </form>
      ) : (
        /* Posts Table List */
        <div className="bg-white rounded-2xl border border-[#E6E1DC] shadow-sm overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8C7F75]">
              <FaNewspaper className="w-8 h-8 mx-auto text-[#D6CDC4] mb-2" />
              لا توجد مقالات منشورة بعد. ابدأ بإنشاء أول مقال الآن.
            </div>
          ) : (
            <div className="divide-y divide-[#E6E1DC]">
              {posts.map((post) => (
                <div key={post.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex items-center gap-4">
                    {post.cover_image && (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E6E1DC] shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#141110]">{post.title}</h4>
                        {post.title_en && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            🇬🇧 EN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8C7F75] mt-1 font-mono">/{post.slug}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {post.status === 'published' ? 'منشور' : 'مسودة'}
                        </span>
                        {(post.word_count || 0) > 0 && (
                          <span className="text-[11px] text-[#8C7F75] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E1DC]">
                            {post.word_count} كلمة
                          </span>
                        )}
                        {(post.seo_score || 0) > 0 && (
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                            SEO: {post.seo_score}/100
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 text-[#5C544E] hover:bg-white rounded-lg border border-[#E6E1DC]"
                      title="معاينة في الموقع"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(post)}
                      className="p-2 text-[#5C544E] hover:bg-white rounded-lg border border-[#E6E1DC]"
                      title="تعديل"
                    >
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200"
                      title="حذف"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
