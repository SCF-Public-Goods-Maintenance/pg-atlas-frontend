import { Skeleton } from "../../../components/atoms/Skeleton";

export function RepoDetailSkeleton() {
  return (
    <div className="flex h-full flex-col" aria-busy="true" aria-live="polite">
      {/* Breadcrumb + title + canonical id */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <span className="text-surface-dark/30 dark:text-white/20">/</span>
        <Skeleton className="h-3 w-32" />
        <span className="text-surface-dark/30 dark:text-white/20">/</span>
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-9 w-80" />
      <Skeleton className="mt-2 h-5 w-96" />

      <div className="no-scrollbar mt-6 flex-1 min-h-0 space-y-5 overflow-auto">
        {/* MetricsPanel skeleton */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "border-l-red-200",
              "border-l-amber-200",
              "border-l-yellow-200",
            ].map((border, i) => (
              <div
                key={i}
                className={`rounded-xl border border-gray-100 border-l-4 ${border} bg-gray-50/50 p-5 dark:border-white/10 dark:border-l-white/10 dark:bg-white/5`}
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-8 w-20" />
                <Skeleton className="mt-2 h-4 w-28" />
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-5 dark:border-white/10">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-36" />
          </div>
        </section>

        {/* Parent project skeleton */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 px-5 py-4 dark:border-white/15">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="ml-auto h-5 w-5" />
          </div>
        </section>

        {/* DependenciesPanel skeleton */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {["depends-on", "has-dependents"].map((col) => (
              <div
                key={col}
                className="rounded-xl border border-gray-100 p-4 dark:border-white/10"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="ml-auto h-4 w-4" />
                </div>
                <div className="space-y-1.5">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
