import React from 'react'
import { Link } from 'react-router-dom'

export default function OfferDetail() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-[#F2EFE8]">تفاصيل العرض الخاص</h1>
      <Link to="/offers" className="text-xs text-[#C4A070] mt-4 inline-block">العودة للعروض</Link>
    </div>
  )
}
