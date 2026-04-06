import { Skeleton } from "./Skeleton";

/**
 * Generic full-page skeleton used as the Suspense fallback for lazy-loaded
 * route components. Mirrors the rough shape of a dashboard page (header strip +
 * two grid rows) so the layout doesn't jump on first render.
 */
export function RouteFallback() {
  return (
    <div
      className="flex h-full flex-col bg-surface-light dark:bg-surface-dark"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-3 grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-full min-h-[280px] w-full" />
      </div>
      <div className="mt-4 grid flex-1 min-h-0 gap-4 lg:grid-cols-3">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
