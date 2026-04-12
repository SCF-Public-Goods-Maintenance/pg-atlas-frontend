import { Skeleton } from "../../../components/atoms/Skeleton";

/**
 * Table-shaped skeleton placeholder matching the row density of
 * `ContributorsTable`. Rendered inside the `<Suspense>` boundary while
 * the contributors list is in flight.
 */
export function ContributorsTableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-white/15 dark:bg-white/5"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-4 border-b border-gray-100 p-3 dark:border-white/10">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-gray-100 p-3 last:border-0 dark:border-white/5"
        >
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
      ))}
    </div>
  );
}

/**
 * Error-state fallback shown by the parent `<ErrorBoundary>` when the
 * contributors list request fails.
 */
export function ContributorsTableFallback() {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white/40 p-10 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-medium text-surface-dark/60 dark:text-white/60">
        Unable to load contributors right now
      </p>
      <p className="mt-1 text-xs text-surface-dark/40 dark:text-white/40">
        Please refresh the page or try again shortly.
      </p>
    </div>
  );
}
