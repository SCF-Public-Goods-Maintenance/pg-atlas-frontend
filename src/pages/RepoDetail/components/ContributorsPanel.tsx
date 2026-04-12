import { Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Users } from "lucide-react";
import { useRepoContributorsSuspense } from "../../../lib/api/queries/repos";
import { Skeleton } from "../../../components/atoms/Skeleton";
import { ErrorBoundary } from "../../../components/atoms/ErrorBoundary";

const PAGE_SIZE = 10;

/**
 * Top contributors for a single repo, sourced from `getRepoContributors`.
 * Shows commit count and first/last commit date — richer than the
 * contributor summaries embedded on `RepoDetailResponse`.
 */
export default function ContributorsPanel({
  canonicalId,
}: {
  canonicalId: string;
}) {
  return (
    <ErrorBoundary fallback={<ContributorsPanelFallback />}>
      <Suspense fallback={<ContributorsPanelSkeleton />}>
        <ContributorsPanelContent canonicalId={canonicalId} />
      </Suspense>
    </ErrorBoundary>
  );
}

function ContributorsPanelContent({ canonicalId }: { canonicalId: string }) {
  const { data } = useRepoContributorsSuspense(canonicalId, {
    limit: PAGE_SIZE,
  });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <PanelShell total={total}>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-surface-dark/50 dark:text-white/50">
          No contributor data available yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-medium uppercase tracking-wide text-surface-dark/45 dark:text-white/50">
                <th className="pb-3 pr-3 font-medium">Contributor</th>
                <th className="pb-3 pr-3 text-right font-medium">Commits</th>
                <th className="pb-3 pr-3 font-medium">First commit</th>
                <th className="pb-3 pr-3 font-medium">Last commit</th>
                <th className="pb-3" aria-label="Open contributor" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-100 transition-colors hover:bg-gray-50/80 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <Link
                        to="/contributors/$id"
                        params={{ id: String(c.id) }}
                        className="font-medium text-surface-dark hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                      >
                        {c.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-right font-mono text-surface-dark/80 dark:text-white/80">
                    {c.number_of_commits.toLocaleString()}
                  </td>
                  <td className="py-3 pr-3 text-surface-dark/60 dark:text-white/50">
                    {formatDate(c.first_commit_date)}
                  </td>
                  <td className="py-3 pr-3 text-surface-dark/60 dark:text-white/50">
                    {formatDate(c.last_commit_date)}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to="/contributors/$id"
                      params={{ id: String(c.id) }}
                      aria-label={`View ${c.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-dark/30 transition-colors hover:bg-gray-100 hover:text-surface-dark/70 dark:text-white/30 dark:hover:bg-white/10 dark:hover:text-white/70"
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelShell>
  );
}

function PanelShell({
  total,
  children,
}: {
  total: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Contributors
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-surface-dark/60 dark:bg-white/10 dark:text-white/50">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {total.toLocaleString()}
        </span>
      </div>
      {children}
    </section>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function ContributorsPanelSkeleton() {
  return (
    <PanelShell total={0}>
      <div className="mt-4 space-y-2" aria-busy="true" aria-live="polite">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-white/10"
          >
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <div className="ml-auto flex gap-6">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export function ContributorsPanelFallback() {
  return (
    <PanelShell total={0}>
      <p className="mt-4 text-sm text-surface-dark/50 dark:text-white/50">
        Unable to load contributors right now.
      </p>
    </PanelShell>
  );
}
