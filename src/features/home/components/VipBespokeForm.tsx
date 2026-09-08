import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../../lib/supabase'
import { fadeUp, viewportOnce, hoverScale, tapScale, springHover } from '../../../constants/animations'
import { 
  FaPaperPlane, 
  FaUser, 
  FaPhone, 
  FaPen, 
  FaCalendarDays, 
  FaCircleCheck, 
  FaWhatsapp, 
  FaSpinner 
} from 'react-icons/fa6'

interface VipBespokeFormProps {
  whatsappNum: string
  isEn: boolean
}

export const VipBespokeForm: React.FC<VipBespokeFormProps> = ({ whatsappNum, isEn }) => {
  const { t } = useTranslation('contact')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'fullVilla',
    preferredTime: 'morning',
    message: ''
  })

  const [formStatus, setFormStatus] = useState<{
    submitting: boolean
    submitted: boolean
    error: string | null
  }>({
    submitting: false,
    submitted: false,
    error: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormStatus(prev => ({ ...prev, error: t('form.errorRequired') }))
      return
    }

    setFormStatus({ submitting: true, submitted: false, error: null })

    try {
      try {
        await supabase.from('inquiries').insert([{
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          service_type: formData.serviceType,
          preferred_time: formData.preferredTime,
          message: formData.message.trim(),
          created_at: new Date().toISOString()
        }])
      } catch (dbErr: unknown) {
        console.info('Inquiries table log:', (dbErr as Error)?.message)
      }

      setFormStatus({ submitting: false, submitted: true, error: null })
    } catch {
      setFormStatus({ submitting: false, submitted: false, error: t('form.errorGeneral') })
    }
  }

  const handleDirectWhatsApp = () => {
    const serviceLabel = t(`form.serviceOptions.${formData.serviceType}` as const, { defaultValue: formData.serviceType })
    const timeLabel = t(`form.timeOptions.${formData.preferredTime}` as const, { defaultValue: formData.preferredTime })
    const text = t('form.whatsappPayload', {
      name: formData.name || (isEn ? 'Not specified' : 'غير محدد'),
      phone: formData.phone || (isEn ? 'Not specified' : 'غير محدد'),
      serviceType: serviceLabel,
      preferredTime: timeLabel,
      message: formData.message || (isEn ? 'None' : 'لا يوجد')
    })
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      serviceType: 'fullVilla',
      preferredTime: 'morning',
      message: ''
    })
    setFormStatus({ submitting: false, submitted: false, error: null })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full pt-4">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="relative w-full space-y-6"
      >
        <div className="relative z-10 space-y-6">
          {/* Form Header */}
          <div className="border-b border-[#C4A070]/20 pb-5">
            <div className="space-y-2 text-start">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C4A070]">
                <FaPaperPlane className="w-3.5 h-3.5" />
                <span className="tracking-wider uppercase">{t('form_badge')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F2EFE8]">
                {t('form_title')}
              </h3>
              <p className="text-xs sm:text-sm text-[#DEDAD6] leading-relaxed">
                {t('form_desc')}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {formStatus.submitted ? (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-10 px-6 text-center space-y-4 rounded-2xl bg-[#C4A070]/10 border border-[#C4A070]/30"
              >
                <div className="w-16 h-16 rounded-full bg-[#C4A070]/20 border border-[#C4A070]/40 text-[#C4A070] flex items-center justify-center mx-auto text-3xl">
                  <FaCircleCheck />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif text-xl font-bold text-[#F2EFE8]">
                    {t('success_title')}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#DEDAD6] max-w-lg mx-auto leading-relaxed">
                    {t('success_desc')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleDirectWhatsApp}
                    className="px-6 py-3 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>{t('open_whatsapp_direct')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[#DEDAD6] text-xs font-medium border border-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                  >
                    <span>{t('send_another')}</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleFormSubmit}
                className="space-y-5"
              >
                {/* Inputs Grid: 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-start">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="vip-input-name" className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                      <FaUser className="w-3 h-3 text-[#C4A070]" />
                      <span>{t('name_label')}</span>
                    </label>
                    <input
                      id="vip-input-name"
                      type="text"
                      name="name"
                      required
                      placeholder={t('name_placeholder')}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] placeholder-[#A69B95] text-xs sm:text-sm outline-none transition-all shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="vip-input-phone" className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                      <FaPhone className="w-3 h-3 text-[#C4A070]" />
                      <span>{t('phone_label')}</span>
                    </label>
                    <input
                      id="vip-input-phone"
                      type="tel"
                      name="phone"
                      required
                      placeholder={t('phone_placeholder')}
                      value={formData.phone}
                      onChange={handleInputChange}
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] placeholder-[#A69B95] text-xs sm:text-sm outline-none transition-all text-start font-mono shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                    />
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <label htmlFor="vip-select-service" className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                      <FaPen className="w-3 h-3 text-[#C4A070]" />
                      <span>{t('service_label')}</span>
                    </label>
                    <select
                      id="vip-select-service"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      style={{ color: '#F2EFE8', backgroundColor: '#141110' }}
                      className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] text-xs sm:text-sm outline-none transition-all cursor-pointer font-medium shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                    >
                      <option value="fullVilla" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.villa')}</option>
                      <option value="bespoke" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.bespoke')}</option>
                      <option value="visit" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.visit')}</option>
                      <option value="limited" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.limited')}</option>
                      <option value="collab" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('service_options.collab')}</option>
                    </select>
                  </div>

                  {/* Preferred Time */}
                  <div className="space-y-2">
                    <label htmlFor="vip-select-time" className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                      <FaCalendarDays className="w-3 h-3 text-[#C4A070]" />
                      <span>{t('time_label')}</span>
                    </label>
                    <select
                      id="vip-select-time"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      style={{ color: '#F2EFE8', backgroundColor: '#141110' }}
                      className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] text-xs sm:text-sm outline-none transition-all cursor-pointer font-medium shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                    >
                      <option value="morning" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('time_options.morning')}</option>
                      <option value="evening" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('time_options.evening')}</option>
                      <option value="anytime" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('time_options.anytime')}</option>
                      <option value="whatsapp_only" style={{ backgroundColor: '#141110', color: '#F2EFE8' }}>{t('time_options.whatsapp_only')}</option>
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2 text-start">
                  <label htmlFor="vip-textarea-message" className="text-xs font-bold text-[#F2EFE8] flex items-center gap-2">
                    <span>{t('message_label')}</span>
                  </label>
                  <textarea
                    id="vip-textarea-message"
                    name="message"
                    rows={3}
                    placeholder={t('message_placeholder')}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#141110] border border-[#C4A070]/35 focus:border-[#C4A070] text-[#F2EFE8] placeholder-[#A69B95] text-xs sm:text-sm outline-none transition-all resize-none shadow-sm focus:ring-1 focus:ring-[#C4A070]/40"
                  />
                </div>

                {formStatus.error && (
                  <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-500/20 p-3 rounded-xl">
                    {formStatus.error}
                  </p>
                )}

                {/* Submit & WhatsApp Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <motion.button
                    whileHover={hoverScale}
                    whileTap={tapScale}
                    transition={springHover}
                    type="button"
                    onClick={handleDirectWhatsApp}
                    className="w-full sm:w-auto py-3.5 px-7 rounded-full bg-[#C4A070]/15 hover:bg-[#C4A070] hover:text-[#1C1816] border border-[#C4A070]/40 text-[#E3CAA9] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>{t('instant_whatsapp_btn')}</span>
                  </motion.button>

                  <motion.button
                    whileHover={hoverScale}
                    whileTap={tapScale}
                    transition={springHover}
                    type="submit"
                    disabled={formStatus.submitting}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-full gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none"
                  >
                    {formStatus.submitting ? (
                      <>
                        <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                        <span>{t('submitting')}</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="w-3 h-3" />
                        <span>{t('submit_btn')}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default VipBespokeForm
