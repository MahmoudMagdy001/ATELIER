import React, { useEffect } from 'react'
import { FaXmark } from 'react-icons/fa6'

export default function LuxuryModal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-3xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div 
        className={`relative w-full ${maxWidth} my-8 bg-[#1C1816] border border-[#C4A070]/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#C4A070]/15 flex items-center justify-between bg-[#141110]/60">
          <div>
            <h3 className="text-lg font-bold text-[#F2EFE8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C4A070]"></span>
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#B3A9A3] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#B3A9A3] hover:text-[#F2EFE8] hover:bg-white/5 transition-all cursor-pointer"
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 text-[#F2EFE8]">
          {children}
        </div>
      </div>
    </div>
  )
}
