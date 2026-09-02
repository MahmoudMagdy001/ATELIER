import { memo } from 'react'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Spinner = memo(function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      className={`rounded-full border-[#C4A070]/20 border-t-[#C4A070] animate-spin ${sizeClasses[size] || sizeClasses.md} ${className}`}
      role="status"
      aria-label="جار التحميل..."
    />
  )
})

export interface PageLoadingProps {
  text?: string
}

export const PageLoading = memo(function PageLoading({ text = 'جار تحميل البيانات...' }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 p-8">
      <Spinner size="lg" />
      <p className="text-xs text-[#827771] font-medium">{text}</p>
    </div>
  )
})

export interface CardSkeletonProps {
  aspect?: string
}

export const CardSkeleton = memo(function CardSkeleton({ aspect = 'aspect-square' }: CardSkeletonProps) {
  return (
    <div className="rounded-3xl bg-[#141110] border border-[#C4A070]/10 p-6 space-y-4 animate-pulse">
      <div className={`w-full ${aspect} bg-white/5 rounded-2xl`} />
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded-full w-3/4" />
        <div className="h-3 bg-white/5 rounded-full w-1/2" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <div className="h-4 bg-[#C4A070]/20 rounded-full w-20" />
        <div className="h-4 bg-white/5 rounded-full w-12" />
      </div>
    </div>
  )
})

export interface GridSkeletonProps {
  count?: number
  cols?: string
}

export const GridSkeleton = memo(function GridSkeleton({ count = 6, cols = 'sm:grid-cols-2 lg:grid-cols-3' }: GridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 ${cols} gap-8 max-w-7xl mx-auto px-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
})

export default PageLoading
