import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { HelpCircle, TrendingUp } from "lucide-react";
import type { ProjectSummary } from "@pg-atlas/data-sdk";
import { useProjectsListSuspense } from "../../../lib/api/queries/projects";
import { Skeleton } from "../../../components/atoms/Skeleton";

const SKELETON_ROW_COUNT = 12;
const TOP_SAMPLE_SIZE = 100;

const TOP_DISPLAY_COUNT = 10;

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl bg-white p-3 sm:p-4 shadow-sm dark:bg-white/5 dark:border dark:border-white/15 dark:shadow-none">
      {children}
    </div>
  );
}

function Header({ right }: { right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <TrendingUp
          className="h-4 w-4 text-surface-dark/50 dark:text-white/40"
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
          Top Critical Projects
        </h3>
      </div>
      {right}
    </div>
  );
}

/**
 * Column header with an inline help tooltip explaining what the column
 * represents. Used across real + skeleton renderings so the explanation
 * is visible regardless of data state.
 */
function ColumnHeader({
  label,
  tooltip,
  align = "left",
}: {
  label: string;
  tooltip: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`group relative inline-flex items-center gap-1 ${
        align === "right" ? "flex-row-reverse" : ""
      }`}
    >
      <span>{label}</span>
      <HelpCircle
        className="h-3 w-3 shrink-0 cursor-help text-surface-dark/30 dark:text-white/25"
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute top-full z-10 mt-2 w-56 whitespace-normal rounded-lg bg-surface-dark px-3 py-2 text-xs font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-surface-dark ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        {tooltip}
      </div>
    </div>
  );
}

/**
 * Top-N projects sorted by `criticality_score` (descending). Reads the
 * shared `/projects?limit=100` sample, so it shares its network call
 * with EcosystemHealthCard via the query cache.
 *
 * Must render inside a `<Suspense fallback={<TopCriticalCardSkeleton />}>`
 * boundary and an `<ErrorBoundary fallback={<TopCriticalCardFallback />}>`.
 */
export default function TopCriticalCard() {
  const { data } = useProjectsListSuspense({ limit: TOP_SAMPLE_SIZE, project_type: "public-good" });
  const projects = (data?.items ?? []) as ProjectSummary[];

  /**
   * Sort every fetched project by criticality_score descending, keeping
   * nulls at the end so the table still populates while the backend has
   * not computed scores yet. Missing score/pony cells render as "—".
   */
  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const aScore = a.criticality_score;
        const bScore = b.criticality_score;
        if (aScore == null && bScore == null) return 0;
        if (aScore == null) return 1;
        if (bScore == null) return -1;
        return bScore - aScore;
      })
      .slice(0, TOP_DISPLAY_COUNT);
  }, [projects]);

  if (topProjects.length === 0) {
    return (
      <CardShell>
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 p-6 text-center dark:border-white/10">
          <TrendingUp
            className="h-6 w-6 text-surface-dark/20 dark:text-white/20"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-surface-dark/60 dark:text-white/70">
            No projects available
          </p>
          <p className="text-xs text-surface-dark/40 dark:text-white/50">
            The projects list is empty. Retry on your next refresh.
          </p>
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <Header />
      <div className="flex-1 rounded-xl border border-gray-100 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-white/10 dark:bg-white/[0.02]">
              <th className="px-3 py-2 text-sm font-medium text-surface-dark/40 dark:text-white/70">
                #
              </th>
              <th className="px-3 py-2 text-sm font-medium text-surface-dark/40 dark:text-white/70">
                <ColumnHeader
                  label="Project"
                  tooltip="Public good project tracked by PG Atlas. Click a row to open its detail page."
                />
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-surface-dark/40 dark:text-white/70">
                <ColumnHeader
                  label="Criticality"
                  tooltip="Criticality score — a 0–10 measure of how load-bearing this project is for the ecosystem. Higher means more downstream projects depend on it."
                />
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-surface-dark/40 dark:text-white/70">
                <ColumnHeader
                  label="Pony Factor"
                  tooltip="Pony factor — the minimum number of contributors whose departure would cause the project to stall. Lower means more concentration risk."
                />
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-surface-dark/40 dark:text-white/70">
                <ColumnHeader
                  label="Status"
                  tooltip="Current activity status of the project — live, in-dev, discontinued, or non-responsive."
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {topProjects.map((p, idx) => (
              <tr
                key={p.canonical_id}
                className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.03]"
              >
                <td className="px-3 py-2 text-sm text-surface-dark/30 dark:text-white/20">
                  {idx + 1}
                </td>
                <td className="px-3 py-2">
                  <Link
                    to="/projects/$canonicalId"
                    params={{ canonicalId: p.canonical_id }}
                    className="text-sm font-medium text-surface-dark hover:text-primary-500 dark:text-white"
                  >
                    {p.display_name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-left font-mono text-sm">
                  {p.criticality_score != null
                    ? p.criticality_score.toFixed(2)
                    : "—"}
                </td>
                <td className="px-3 py-2 text-left font-mono text-sm">
                  {p.pony_factor ?? "—"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.activity_status === "live"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : p.activity_status === "in-dev"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : p.activity_status === "discontinued"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60"
                    }`}
                  >
                    {p.activity_status ?? "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardShell>
  );
}

/** Suspense fallback — themed skeleton rows at natural row height. */
export function TopCriticalCardSkeleton() {
  return (
    <CardShell>
      <Header right={<Skeleton className="h-3 w-16" />} />
      <div
        className="flex-1 rounded-xl border border-gray-100 dark:border-white/10"
        aria-busy="true"
        aria-live="polite"
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-white/10 dark:bg-white/[0.02]">
              <th className="px-3 py-2 text-sm font-medium text-surface-dark/40 dark:text-white/70">
                #
              </th>
              <th className="px-3 py-2 text-sm font-medium text-surface-dark/40 dark:text-white/70">
                Project
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-surface-dark/40 dark:text-white/70">
                Criticality
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-surface-dark/40 dark:text-white/70">
                Pony Factor
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-surface-dark/40 dark:text-white/70">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
              <tr key={`skeleton-${idx}`}>
                <td className="px-3 py-2">
                  <Skeleton className="h-3 w-4" />
                </td>
                <td className="px-3 py-2">
                  <Skeleton className="h-3 w-28" />
                </td>
                <td className="px-3 py-2">
                  <Skeleton className="h-3 w-10" />
                </td>
                <td className="px-3 py-2">
                  <Skeleton className="h-3 w-6" />
                </td>
                <td className="px-3 py-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardShell>
  );
}

/** Error-state fallback — same empty state layout used for no-score case. */
export function TopCriticalCardFallback() {
  return (
    <CardShell>
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 p-6 text-center dark:border-white/10">
        <TrendingUp
          className="h-6 w-6 text-surface-dark/20 dark:text-white/20"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-surface-dark/60 dark:text-white/70">
          Top critical data unavailable
        </p>
        <p className="text-xs text-surface-dark/40 dark:text-white/50">
          We'll retry on your next refresh.
        </p>
      </div>
    </CardShell>
  );
}
