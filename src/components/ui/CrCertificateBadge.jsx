import React from 'react'
import { FaAward } from 'react-icons/fa6'
import crCertificatePdf from '../../assets/CrCertificate.pdf'
import { CONTACT_INFO } from '../../constants/contactInfo'

export default function CrCertificateBadge({ className = '' }) {
  return (
    <a
      href={crCertificatePdf}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`استعراض شهادة السجل التجاري المعتمدة لشركة S&I Atelier (تاريخ التأسيس: ${CONTACT_INFO.foundedDate})`}
      title={`استعراض شهادة السجل التجاري المعتمدة • تاريخ التأسيس: ${CONTACT_INFO.foundedDate}`}
      className={`group relative inline-flex items-center justify-center select-none ${className}`}
    >
      {/* Ambient Gold Glow on Hover */}
      <div className="absolute inset-0 rounded-full bg-[#C4A070]/0 group-hover:bg-[#C4A070]/25 blur-lg transition-all duration-500" />

      {/* Main Circular Seal Container */}
      <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-b from-[#C4A070]/70 via-[#C4A070]/20 to-[#C4A070]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_24px_rgba(196,160,112,0.4)] group-hover:scale-105 transition-all duration-300">
        
        {/* Inner Border & Obsidian Luxury Core */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#241C16] via-[#161210] to-[#0A0908] border border-[#C4A070]/40 flex flex-col items-center justify-center text-center px-2 py-1 overflow-hidden">
          
          {/* Concentric Thin Decorative Ring */}
          <div className="absolute inset-1.5 rounded-full border border-[#C4A070]/20 pointer-events-none" />

          {/* Smooth Light Sheen Sweep on Hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none" />

          {/* Luxury Gold Medal / Seal Icon */}
          <FaAward className="w-4 h-4 text-[#C4A070] mb-0.5 shrink-0 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_1px_4px_rgba(196,160,112,0.4)]" />

          {/* Central Title */}
          <span className="text-[10px] sm:text-[11px] font-bold text-[#F2EFE8] leading-tight font-serif tracking-wide">
            السجل التجاري
          </span>

          {/* Verification Tag */}
          <span className="text-[7.5px] sm:text-[8px] text-[#C4A070] font-medium tracking-wider mt-0.5 flex items-center gap-1">
            <span className="text-[5px] text-[#C4A070]/80">✦</span>
            معتمد
            <span className="text-[5px] text-[#C4A070]/80">✦</span>
          </span>

          {/* Founding Year */}
          <span className="text-[7px] sm:text-[7.5px] text-[#B3A9A3]/90 font-mono tracking-wider mt-0.5">
            تأسست {CONTACT_INFO.foundedYear}
          </span>
        </div>
      </div>
    </a>
  )
}
