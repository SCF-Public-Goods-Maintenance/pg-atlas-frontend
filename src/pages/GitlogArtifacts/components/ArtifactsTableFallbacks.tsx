import { Skeleton } from "../../../components/atoms/Skeleton";

export function ArtifactsTableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-white/15 dark:bg-white/5"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-4 border-b border-gray-100 p-3 dark:border-white/10">
        {["ID", "Repo", "Status", "Window", "Submitted", "Processed"].map(
          (label) => (
            <Skeleton key={label} className="h-4 w-20" />
          ),
        )}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-gray-100 p-3 last:border-0 dark:border-white/5"
        >
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
}

export function ArtifactsTableFallback() {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white/40 p-10 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-medium text-surface-dark/60 dark:text-white/60">
        Unable to load gitlog artifacts right now
      </p>
      <p className="mt-1 text-xs text-surface-dark/40 dark:text-white/40">
        Please refresh the page or try again shortly.
      </p>
    </div>
  );
}
