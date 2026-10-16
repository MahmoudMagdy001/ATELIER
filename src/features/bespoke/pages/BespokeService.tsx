import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import SEO from '../../../components/ui/SEO'
import { CONTACT_INFO } from '../../../constants/contactInfo'
import { portfolioService } from '../../portfolio/services/portfolioService'
import PortfolioLightbox from '../../home/components/PortfolioLightbox'
import { 
  fadeUp, 
  heroStagger, 
  staggerContainer, 
  viewportOnce, 
  springHover, 
  cardHover,
  hoverScale, 
  tapScale 
} from '../../../constants/animations'
import { 
  FaPhone, 
  FaWhatsapp, 
  FaCouch,
  FaCrown,
  FaBed,
  FaLayerGroup,
  FaArrowDown
} from 'react-icons/fa6'
import type { PortfolioItem } from '../../../types/database'

interface DisciplineItem {
  id: string
  title: string
  desc: string
}

export default function BespokeService() {
  const { t, i18n } = useTranslation('bespoke')
  const isEn = i18n.language?.startsWith('en')

  const [projects, setProjects] = useState<PortfolioItem[]>([])
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const whatsappNum = CONTACT_INFO.whatsappRaw
  const primaryPhone = CONTACT_INFO.phone

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await portfolioService.fetchVisiblePortfolio()
        setProjects(data)
      } catch (err: unknown) {
        console.warn('Failed to load portfolio projects:', (err as Error)?.message || err)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  const rawDisciplines = t('disciplines', { returnObjects: true })
  const disciplines: DisciplineItem[] = Array.isArray(rawDisciplines) ? (rawDisciplines as DisciplineItem[]) : []

  const disciplineIcons: Record<string, React.ReactNode> = {
    majlis: <FaCouch className="w-5 h-5 text-[#C4A070]" />,
    dining: <FaCrown className="w-5 h-5 text-[#C4A070]" />,
    suites: <FaBed className="w-5 h-5 text-[#C4A070]" />,
    paneling: <FaLayerGroup className="w-5 h-5 text-[#C4A070]" />
  }

  const scrollToProjects = () => {
    const el = document.getElementById('bespoke-projects')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-transparent text-[#F2EFE8] min-h-screen font-sans">
      <SEO
        title={t('meta_title')}
        description={t('meta_description')}
        slug="bespoke"
      />

      {/* 1. MINIMAL EDITORIAL HERO */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 border-b border-[#C4A070]/20 bg-[#141110] overflow-hidden">
        {/* Subtle Brand Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(196,160,112,0.15),rgba(20,17,16,0))] pointer-events-none" />

        <motion.div 
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto text-center space-y-6"
        >
          <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.28em] text-[#C4A070] font-bold block">
            {isEn ? 'HAUTE ÉBÉNISTERIE & BESPOKE COMMISSIONS' : 'خدمة التصنيع المعماري حسب الطلب'}
          </motion.span>

          <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-normal">
            <span className="gold-gradient-text inline-block">
              {t('hero_title_pre')} {t('hero_title_highlight')}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-[#DEDAD6]/90 max-w-2xl mx-auto leading-relaxed md:leading-8 font-light">
            {t('hero_subtitle')}
          </motion.p>

          {/* Clean Action Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(t('whatsapp_message'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full gold-btn-primary text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <FaWhatsapp className="w-4 h-4 text-[#1C1816]" />
              <span>{t('whatsapp_btn')}</span>
            </a>

            <button
              type="button"
              onClick={scrollToProjects}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full gold-btn-secondary text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{isEn ? 'View Projects' : 'استعراض المشاريع المنفذة'}</span>
              <FaArrowDown className="w-3.5 h-3.5 text-[#C4A070]" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. EDITORIAL COMPLETED PROJECTS (Roche Bobois Showcase) */}
      <section id="bespoke-projects" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 space-y-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-start border-b border-[#C4A070]/20 pb-4 sm:pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3"
        >
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EFE8]">
              {t('projects_title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#A19A91] mt-1 font-light">
              {t('projects_subtitle')}
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[4/3] rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#827771]">
            <p>{isEn ? 'New bespoke project commissions will be unveiled shortly.' : 'سيتم إدراج صور المشاريع المنفذة قريباً.'}</p>
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {projects.map((project, idx) => {
              const projectTitle = isEn ? (project.title_en || project.title) : project.title
              const projectCategory = isEn ? (project.category_en || project.category) : project.category
              const projectDesc = isEn ? (project.description_en || project.description) : project.description

              const projectInquiryText = isEn
                ? `Hello S&I Atelier, I would like to inquire about a bespoke commission similar to: "${projectTitle}"`
                : `مرحباً S&I Atelier، أود الاستفسار عن تفصيل مشروع مماثل لـ: "${projectTitle}"`

              return (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  custom={idx}
                  whileHover={cardHover}
                  transition={springHover}
                  className="group relative rounded-3xl overflow-hidden bg-[#141110] border border-[#C4A070]/20 hover:border-[#C4A070] transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  {/* Project Image */}
                  <div 
                    onClick={() => setSelectedImage(project)}
                    className="relative aspect-[4/3] overflow-hidden bg-[#1C1816] cursor-pointer"
                  >
                    <img
                      src={project.image_url}
                      alt={projectTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141110] via-transparent to-transparent opacity-80" />
                    
                    {projectCategory && (
                      <span className="absolute top-4 end-4 px-3 py-1 rounded-full text-[10px] font-bold bg-[#141110]/85 backdrop-blur-md text-[#C4A070] border border-[#C4A070]/30 uppercase tracking-wider">
                        {projectCategory}
                      </span>
                    )}
                  </div>

                  {/* Minimal Editorial Card Info */}
                  <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between text-start">
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F2EFE8] leading-snug group-hover:text-[#C4A070] transition-colors">
                        {projectTitle}
                      </h3>
                      {projectDesc && (
                        <p className="text-xs text-[#A19A91] line-clamp-2 leading-relaxed font-light">
                          {projectDesc}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedImage(project)}
                        className="text-xs text-[#B3A9A3] hover:text-[#F2EFE8] transition-colors cursor-pointer"
                      >
                        {isEn ? 'View Detail' : 'معاينة الصورة'}
                      </button>

                      <a
                        href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(projectInquiryText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C4A070] hover:text-[#E5C9A3] transition-colors"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5 text-[#C4A070]" />
                        <span>{t('inquire_project_cta')}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </section>

      {/* 3. AREAS OF CRAFTSMANSHIP (مجالات التصنيع) */}
      {disciplines.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="text-start border-b border-[#C4A070]/20 pb-4 sm:pb-6"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F2EFE8]">
              {t('disciplines_title')}
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start"
          >
            {disciplines.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="p-6 rounded-3xl bg-[#141110] border border-[#C4A070]/20 space-y-3 relative shadow-lg hover:border-[#C4A070]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#C4A070]/10 flex items-center justify-center border border-[#C4A070]/20">
                  {disciplineIcons[item.id] || <FaCouch className="w-4 h-4 text-[#C4A070]" />}
                </div>
                <h3 className="font-serif text-base font-bold text-[#F2EFE8] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A19A91] leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 4. DIRECT CONCIERGE ACCESS (بدء مشروعك الخاص) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="rounded-3xl bg-gradient-to-r from-[#7A5D2B] via-[#C4A070] to-[#E5C9A3] p-8 sm:p-12 text-[#1C1816] shadow-2xl space-y-6 text-center relative overflow-hidden"
        >
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              {t('cta_title')}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#26211F] leading-relaxed">
              {t('cta_desc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <motion.a
              whileHover={hoverScale}
              whileTap={tapScale}
              transition={springHover}
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(t('whatsapp_message'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1C1816] text-[#F2EFE8] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xl hover:bg-black transition-all cursor-pointer"
            >
              <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
              <span>{t('whatsapp_btn')}</span>
            </motion.a>

            <motion.a
              whileHover={hoverScale}
              whileTap={tapScale}
              transition={springHover}
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/20 hover:bg-white/30 text-[#1C1816] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <FaPhone className="w-3.5 h-3.5 text-[#1C1816]" />
              <span dir="ltr" className="font-mono">{primaryPhone}</span>
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Lightbox for viewing full-size architectural photo */}
      <PortfolioLightbox
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        isEn={isEn}
      />
    </div>
  )
}
