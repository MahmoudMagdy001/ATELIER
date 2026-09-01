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
  imgOnly = false
}) {
  const imgSizes = {
    sm: 'h-8 w-auto',
    md: 'h-11 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto',
  }

  const titleSizes = {
    sm: 'text-base tracking-[0.25em]',
    md: 'text-xl tracking-[0.28em]',
    lg: 'text-3xl tracking-[0.3em]',
    xl: 'text-4xl tracking-[0.35em]',
  }

  const subSizes = {
    sm: 'text-[7px] tracking-[0.2em]',
    md: 'text-[8.5px] tracking-[0.25em]',
    lg: 'text-[11px] tracking-[0.28em]',
    xl: 'text-[13px] tracking-[0.3em]',
  }

  if (imgOnly) {
    return (
      <img
        src={logoImg}
        alt="ATELIER Logo"
        className={`${imgSizes[size] || 'h-11 w-auto'} object-contain ${className}`}
      />
    )
  }

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <img 
        src={logoImg} 
        alt="ATELIER Logo" 
        className={`${imgSizes[size] || 'h-11 w-auto'} object-contain shrink-0 transition-transform duration-300 group-hover:scale-105`} 
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
            className={`font-sans uppercase font-medium text-[#C4A070] mt-1 ${subSizes[size]}`}
            style={{ fontFamily: "'Plus Jakarta Sans', 'Alexandria', sans-serif" }}
          >
            BESPOKE LUXURY FURNITURE & INTERIORS
          </span>
        )}
      </div>
    </div>
  )
}

