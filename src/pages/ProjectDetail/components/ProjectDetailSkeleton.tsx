import { Skeleton } from "../../../components/atoms/Skeleton";

export function ProjectDetailSkeleton() {
  return (
    <div className="flex h-full flex-col" aria-busy="true" aria-live="polite">
      {/* Breadcrumb + title + canonical id — mirror real sizes */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <span className="text-surface-dark/30 dark:text-white/20">/</span>
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-9 w-80" />
      <Skeleton className="mt-2 h-5 w-96" />

      <div className="no-scrollbar mt-6 flex-1 min-h-0 space-y-5 overflow-auto">
        {/* MetricsPanel skeleton — matches p-6 + larger type */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
          <Skeleton className="mb-4 h-5 w-40" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "border-l-red-100",
              "border-l-amber-100",
              "border-l-emerald-100",
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
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="mt-5 space-y-3 border-t border-gray-100 pt-5 dark:border-white/10">
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-2/3" />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </section>

        {/* ReposPanel skeleton — compact rows */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
          <div className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-100 dark:divide-white/10 dark:border-white/10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="hidden h-3 w-14 sm:block" />
                </div>
                <Skeleton className="h-3.5 w-3.5" />
              </div>
            ))}
          </div>
        </section>

        {/* DependenciesPanel skeleton — matches p-4 columns */}
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
