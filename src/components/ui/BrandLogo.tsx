import logoImg from '../../assets/newlogo.png'

export interface AtelierMonogramProps {
  className?: string
  alt?: string
}

export function AtelierMonogram({ className = 'w-8 h-8 sm:w-10 sm:h-10', alt = 'S&I Atelier Logo' }: AtelierMonogramProps) {
  return (
    <img 
      src={logoImg} 
      alt={alt} 
      className={`${className} object-contain`} 
    />
  )
}

export interface BrandLogoProps {
  showSubtitle?: boolean
  hideSubtitleOnMobile?: boolean
  isLight?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  imgOnly?: boolean
  customLogo?: string | null
  layout?: 'horizontal' | 'stacked'
}

export default function BrandLogo({ 
  showSubtitle = true, 
  hideSubtitleOnMobile = false,
  isLight = false, 
  size = 'md',
  className = '',
  imgOnly = false,
  customLogo = null,
  layout = 'horizontal' // 'horizontal' | 'stacked'
}: BrandLogoProps) {
  const logoSource = customLogo || logoImg

  const imgSizes: Record<string, string> = {
    sm: 'h-6 sm:h-7 md:h-8 w-auto',
    md: 'h-7 sm:h-8 md:h-10 w-auto',
    lg: 'h-8 sm:h-10 md:h-13 w-auto',
    xl: 'h-11 sm:h-14 md:h-18 w-auto',
  }

  const titleSizes: Record<string, string> = {
    sm: 'text-[11px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.18em]',
    md: 'text-xs sm:text-sm md:text-lg tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em]',
    lg: 'text-sm sm:text-base md:text-xl tracking-[0.15em] sm:tracking-[0.19em] md:tracking-[0.24em]',
    xl: 'text-base sm:text-xl md:text-2xl tracking-[0.18em] sm:tracking-[0.22em] md:tracking-[0.28em]',
  }

  const subSizes: Record<string, string> = {
    sm: 'text-[6px] sm:text-[7px] tracking-[0.12em] sm:tracking-[0.15em]',
    md: 'text-[6.5px] sm:text-[7.5px] md:text-[8.5px] tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.2em]',
    lg: 'text-[7px] sm:text-[8px] md:text-[9.5px] tracking-[0.13em] sm:tracking-[0.17em] md:tracking-[0.22em]',
    xl: 'text-[8px] sm:text-[9.5px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.19em] md:tracking-[0.24em]',
  }

  if (imgOnly) {
    return (
      <img
        src={logoSource}
        alt="S&I Atelier Logo"
        className={`${imgSizes[size] || 'h-7 sm:h-8 md:h-10 w-auto'} object-contain ${className}`}
      />
    )
  }

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <img 
          src={logoSource} 
          alt="S&I Atelier Monogram" 
          className={`${imgSizes[size] || 'h-10 sm:h-12 md:h-16 w-auto'} object-contain mb-2 sm:mb-3 transition-transform duration-300 hover:scale-105 drop-shadow-[0_4px_16px_rgba(196,160,112,0.25)]`} 
        />
        <span 
          className={`font-['Cinzel'] font-bold leading-none uppercase whitespace-nowrap ${titleSizes[size]} ${
            isLight ? 'text-[#1C1816]' : 'text-[#F2EFE8]'
          }`}
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          dir="ltr"
        >
          S&I ATELIER
        </span>

        {showSubtitle && (
          <span 
            className={`font-sans uppercase font-medium text-[#C4A070] mt-1 sm:mt-1.5 whitespace-nowrap ${
              hideSubtitleOnMobile ? 'hidden sm:block' : ''
            } ${subSizes[size]}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            dir="ltr"
          >
            BESPOKE LUXURY FURNITURE & INTERIORS
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 md:gap-3.5 select-none ${className}`}>
      <img 
        src={logoSource} 
        alt="S&I Atelier Logo" 
        className={`${imgSizes[size] || 'h-7 sm:h-8 md:h-10 w-auto'} object-contain shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(196,160,112,0.18)]`} 
      />
      
      <div className="flex flex-col text-start justify-center min-w-0">
        <span 
          className={`font-['Cinzel'] font-bold leading-none uppercase whitespace-nowrap ${titleSizes[size]} ${
            isLight ? 'text-[#1C1816]' : 'text-[#F2EFE8]'
          }`}
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          dir="ltr"
        >
          S&I ATELIER
        </span>

        {showSubtitle && (
          <span 
            className={`font-sans uppercase font-semibold text-[#C4A070] mt-1 sm:mt-1.5 whitespace-nowrap ${
              hideSubtitleOnMobile ? 'hidden sm:block' : ''
            } ${subSizes[size]}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            dir="ltr"
          >
            BESPOKE LUXURY FURNITURE & INTERIORS
          </span>
        )}
      </div>
    </div>
  )
}
