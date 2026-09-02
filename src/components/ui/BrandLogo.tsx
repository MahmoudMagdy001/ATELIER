import logoImg from '../../assets/logo.png'

export interface AtelierMonogramProps {
  className?: string
  alt?: string
}

export function AtelierMonogram({ className = 'w-10 h-10', alt = 'S&I Atelier Logo' }: AtelierMonogramProps) {
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
  isLight?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  imgOnly?: boolean
  customLogo?: string | null
  layout?: 'horizontal' | 'stacked'
}

export default function BrandLogo({ 
  showSubtitle = true, 
  isLight = false, 
  size = 'md',
  className = '',
  imgOnly = false,
  customLogo = null,
  layout = 'horizontal' // 'horizontal' | 'stacked'
}: BrandLogoProps) {
  const logoSource = customLogo || logoImg

  const imgSizes: Record<string, string> = {
    sm: 'h-9 md:h-10 w-auto',
    md: 'h-12 md:h-14 w-auto',
    lg: 'h-16 md:h-20 w-auto',
    xl: 'h-24 md:h-28 w-auto',
  }

  const titleSizes: Record<string, string> = {
    sm: 'text-base tracking-[0.24em]',
    md: 'text-xl md:text-2xl tracking-[0.26em]',
    lg: 'text-2xl md:text-3xl tracking-[0.28em]',
    xl: 'text-3xl md:text-4xl tracking-[0.32em]',
  }

  const subSizes: Record<string, string> = {
    sm: 'text-[7.5px] tracking-[0.2em]',
    md: 'text-[9px] md:text-[10px] tracking-[0.24em]',
    lg: 'text-[11px] md:text-[12px] tracking-[0.26em]',
    xl: 'text-[13px] md:text-[14px] tracking-[0.28em]',
  }

  if (imgOnly) {
    return (
      <img
        src={logoSource}
        alt="S&I Atelier Logo"
        className={`${imgSizes[size] || 'h-12 md:h-14 w-auto'} object-contain ${className}`}
      />
    )
  }

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <img 
          src={logoSource} 
          alt="S&I Atelier Monogram" 
          className={`${imgSizes[size] || 'h-16 md:h-20 w-auto'} object-contain mb-3 transition-transform duration-300 hover:scale-105 drop-shadow-[0_4px_16px_rgba(196,160,112,0.25)]`} 
        />
        <span 
          className={`font-['Cinzel'] font-bold leading-none uppercase ${titleSizes[size]} ${
            isLight ? 'text-[#1C1816]' : 'text-[#F2EFE8]'
          }`}
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          dir="ltr"
        >
          S&I ATELIER
        </span>

        {showSubtitle && (
          <span 
            className={`font-sans uppercase font-medium text-[#C4A070] mt-2 ${subSizes[size]}`}
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
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <img 
        src={logoSource} 
        alt="S&I Atelier Logo" 
        className={`${imgSizes[size] || 'h-12 md:h-14 w-auto'} object-contain shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(196,160,112,0.18)]`} 
      />
      
      <div className="flex flex-col text-right justify-center">
        <span 
          className={`font-['Cinzel'] font-bold leading-none uppercase ${titleSizes[size]} ${
            isLight ? 'text-[#1C1816]' : 'text-[#F2EFE8]'
          }`}
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          dir="ltr"
        >
          S&I ATELIER
        </span>

        {showSubtitle && (
          <span 
            className={`font-sans uppercase font-semibold text-[#C4A070] mt-1.5 ${subSizes[size]}`}
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
