import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaXmark } from 'react-icons/fa6'
import type { PortfolioItem } from '../../../types/database'

interface PortfolioLightboxProps {
  selectedImage: PortfolioItem | null
  onClose: () => void
  isEn: boolean
}

export const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({
  selectedImage,
  onClose,
  isEn,
}) => {
  const { t } = useTranslation('home')
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!selectedImage) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage, onClose])

  if (typeof document === 'undefined') return null

  const titleText = selectedImage ? (isEn ? (selectedImage.title_en || selectedImage.title) : selectedImage.title) : ''
  const categoryText = selectedImage ? (isEn ? (selectedImage.category_en || selectedImage.category) : selectedImage.category) : ''
  const descText = selectedImage ? (isEn ? (selectedImage.description_en || selectedImage.description) : selectedImage.description) : ''

  return createPortal(
    <AnimatePresence>
      {selectedImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-lightbox-title"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] bg-[#141110] border border-[#C4A070]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
          >
            <button 
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute top-4 start-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#C4A070] hover:text-[#1C1816] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C4A070] focus-visible:outline-none"
              aria-label={t('lightbox_close')}
            >
              <FaXmark className="w-4 h-4" />
            </button>
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/60 p-2">
              <img 
                src={selectedImage.image_url} 
                alt={titleText}
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>
            <div className="p-6 space-y-2 border-t border-white/10 bg-[#141110] shrink-0 text-start">
              <div className="flex items-center justify-between">
                <h3 id="portfolio-lightbox-title" className="font-serif text-xl font-bold text-[#F2EFE8]">
                  {titleText}
                </h3>
                {categoryText && (
                  <span className="text-xs px-3 py-1 rounded-full bg-[#C4A070]/20 text-[#C4A070] font-bold">
                    {categoryText}
                  </span>
                )}
              </div>
              {descText && (
                <p className="text-xs text-[#DEDAD6]/80 leading-relaxed">
                  {descText}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default PortfolioLightbox
