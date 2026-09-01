import React from 'react'
import logoImg from '../../assets/logo.png'

export function AtelierMonogram({ className = 'w-10 h-10', alt = 'ATELIER Logo' }) {
  return (
    <img 
      src={logoImg} 
      alt={alt} 
      className={`${className} object-contain`} 
    />
  )
}

export default function BrandLogo({ 
  showSubtitle = true, 
  isLight = false, 
  size = 'md',
  className = '',
  imgOnly = false,
  customLogo = null
}) {
  const logoSource = customLogo || logoImg

  const imgSizes = {
    sm: 'h-10 md:h-12 w-auto',
    md: 'h-14 md:h-16 w-auto',
    lg: 'h-18 md:h-20 w-auto',
    xl: 'h-24 md:h-28 w-auto',
  }

  const titleSizes = {
    sm: 'text-base tracking-[0.22em]',
    md: 'text-xl md:text-2xl tracking-[0.25em]',
    lg: 'text-2xl md:text-3xl tracking-[0.28em]',
    xl: 'text-3xl md:text-4xl tracking-[0.32em]',
  }

  const subSizes = {
    sm: 'text-[7.5px] tracking-[0.18em]',
    md: 'text-[9px] md:text-[10px] tracking-[0.22em]',
    lg: 'text-[11px] md:text-[12px] tracking-[0.25em]',
    xl: 'text-[13px] md:text-[14px] tracking-[0.28em]',
  }

  if (imgOnly) {
    return (
      <img
        src={logoSource}
        alt="ATELIER Logo"
        className={`${imgSizes[size] || 'h-14 md:h-16 w-auto'} object-contain ${className}`}
      />
    )
  }

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <img 
        src={logoSource} 
        alt="ATELIER Logo" 
        className={`${imgSizes[size] || 'h-14 md:h-16 w-auto'} object-contain shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(196,160,112,0.15)]`} 
      />
      
      <div className="flex flex-col text-right justify-center">
        <span 
          className={`font-['Cinzel'] font-bold leading-none ${titleSizes[size]} ${
            isLight ? 'text-[#1C1816]' : 'text-[#F2EFE8]'
          }`}
          style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
        >
          ATELIER
        </span>

        {showSubtitle && (
          <span 
            className={`font-sans uppercase font-medium text-[#C4A070] mt-1.5 ${subSizes[size]}`}
            style={{ fontFamily: "'Plus Jakarta Sans', 'Alexandria', sans-serif" }}
          >
            BESPOKE LUXURY FURNITURE & INTERIORS
          </span>
        )}
      </div>
    </div>
  )
}

