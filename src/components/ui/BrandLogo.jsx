import React from 'react'

export function AtelierMonogram({ className = 'w-10 h-10', color = '#C4A070' }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0DEC8" />
          <stop offset="40%" stopColor="#C4A070" />
          <stop offset="80%" stopColor="#9E7939" />
          <stop offset="100%" stopColor="#E5C9A3" />
        </linearGradient>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C4A070" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Entwined Architectural Ribbon Monogram */}
      <g filter="url(#goldGlow)">
        {/* Left ascending ribbon loop */}
        <path
          d="M 32,70 C 18,52 20,28 35,26 C 45,24 50,38 50,50 C 50,62 55,76 65,74 C 80,72 82,48 68,30"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right ascending ribbon loop */}
        <path
          d="M 68,70 C 82,52 80,28 65,26 C 55,24 50,38 50,50 C 50,62 45,76 35,74 C 20,72 18,48 32,30"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Center tying arc & floral loop */}
        <ellipse
          cx="50"
          cy="48"
          rx="14"
          ry="22"
          stroke="url(#goldGradient)"
          strokeWidth="5"
          fill="none"
          transform="rotate(-15 50 48)"
        />
        <ellipse
          cx="50"
          cy="52"
          rx="14"
          ry="22"
          stroke="url(#goldGradient)"
          strokeWidth="5"
          fill="none"
          transform="rotate(15 50 52)"
        />
      </g>
    </svg>
  )
}

export default function BrandLogo({ 
  showSubtitle = true, 
  isLight = false, 
  size = 'md',
  className = '' 
}) {
  const monogramSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
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

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <AtelierMonogram className={`${monogramSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`} />
      
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
            className={`font-sans uppercase font-bold text-[#C4A070] mt-1 ${subSizes[size]}`}
            style={{ fontFamily: "'Cairo', 'Plus Jakarta Sans', sans-serif" }}
          >
            BESPOKE LUXURY FURNITURE & INTERIORS
          </span>
        )}
      </div>
    </div>
  )
}
