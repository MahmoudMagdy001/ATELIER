import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

export const BrandValuesRibbon: React.FC = memo(() => {
  const { t } = useTranslation('home')

  return (
    <section className="border-y border-[#C4A070]/20 bg-gradient-to-r from-[#141110] via-[#1C1816] to-[#141110] py-6 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x rtl:md:divide-x-reverse divide-[#C4A070]/15">
          <div className="space-y-1">
            <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
              LUXURY
            </span>
            <p className="text-[11px] text-[#B3A9A3]">{t('ribbon.luxury')}</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
              MINIMAL
            </span>
            <p className="text-[11px] text-[#B3A9A3]">{t('ribbon.minimal')}</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
              TIMELESS
            </span>
            <p className="text-[11px] text-[#B3A9A3]">{t('ribbon.timeless')}</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-sm md:text-base font-extrabold tracking-[0.25em] text-[#C4A070] block uppercase" dir="ltr">
              BESPOKE
            </span>
            <p className="text-[11px] text-[#B3A9A3]">{t('ribbon.bespoke')}</p>
          </div>
        </div>
      </div>
    </section>
  )
})

export default BrandValuesRibbon
