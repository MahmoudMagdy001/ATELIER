import { memo } from 'react'

export const Spinner = memo(function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      className={`rounded-full border-[#C5A880]/20 border-t-[#C5A880] animate-spin ${sizeClasses[size] || sizeClasses.md} ${className}`}
      role="status"
      aria-label="جار التحميل..."
    />
  )
})

export const PageLoading = memo(function PageLoading({ text = 'جار تحميل البيانات...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 p-8">
      <Spinner size="lg" />
      <p className="text-xs text-[#8C7F75] font-medium">{text}</p>
    </div>
  )
})

export default PageLoading
