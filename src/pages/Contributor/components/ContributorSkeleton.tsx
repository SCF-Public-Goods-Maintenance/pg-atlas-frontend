import { Skeleton } from "../../../components/atoms/Skeleton";

export function ContributorSkeleton() {
  return (
    <div className="flex h-full flex-col" aria-busy="true" aria-live="polite">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <span className="text-surface-dark/30 dark:text-white/20">/</span>
        <Skeleton className="h-3 w-28" />
        <span className="text-surface-dark/30 dark:text-white/20">/</span>
        <Skeleton className="h-3 w-36" />
      </div>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-2 h-5 w-32" />

      <div className="no-scrollbar mt-6 flex-1 min-h-0 space-y-5 overflow-auto">
        {/* Profile panel skeleton */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
          <div className="flex items-center gap-4 mb-5">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["border-l-blue-200", "border-l-emerald-200"].map((border, i) => (
              <div
                key={i}
                className={`rounded-xl border border-gray-100 border-l-4 ${border} bg-gray-50/50 p-5 dark:border-white/10 dark:border-l-white/10 dark:bg-white/5`}
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-8 w-16" />
              </div>
            ))}
          </div>
        </section>

        {/* Repo contributions skeleton */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 dark:border-white/15 dark:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
