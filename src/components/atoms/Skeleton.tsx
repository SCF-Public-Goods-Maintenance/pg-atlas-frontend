import type { SkeletonProps } from '../../types'

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-white/10 ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:bg-white/5 dark:border-white/15">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-4 w-4 shrink-0" />
    </div>
  )
}

export function SkeletonTable({ rows = 10, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/5 dark:border-white/15">
      {/* Header */}
      <div className="flex gap-4 border-b border-gray-200 bg-gray-50/50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0 dark:border-white/5"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-3.5 flex-1 ${c === 0 ? "max-w-[200px]" : "max-w-[100px]"}`}
            />
          ))}
        </div>
      ))}
      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3 dark:border-white/10">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  )
}
