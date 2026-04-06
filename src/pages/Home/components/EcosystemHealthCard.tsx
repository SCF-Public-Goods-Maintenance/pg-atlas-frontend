import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import type { ProjectSummary, MetadataResponse } from "@pg-atlas/data-sdk";
import type { PieLabelRenderProps } from "../../../types";
import { useProjectsListSuspense } from "../../../lib/api/queries/projects";
import { useMetadataSuspense } from "../../../lib/api/queries/metadata";
import { Skeleton } from "../../../components/atoms/Skeleton";

interface RiskBucket {
  label: string;
  count: number;
  color: string;
}

interface RiskDistribution {
  buckets: RiskBucket[];
  scoredCount: number;
  unscoredCount: number;
}

const RISK_COLORS = {
  low: "#10b981",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
} as const;

/**
 * Bucket projects by `criticality_score` (integer, typically 0–10).
 * Projects with a `null` score are counted separately as "unscored" so
 * the pie never misrepresents the distribution as risk buckets when the
 * backend hasn't computed scores yet.
 */
function bucketProjects(projects: ProjectSummary[]): RiskDistribution {
  let low = 0;
  let medium = 0;
  let high = 0;
  let critical = 0;
  let unscored = 0;

  for (const p of projects) {
    const score = p.criticality_score;
    if (score == null) {
      unscored += 1;
      continue;
    }
    if (score >= 9) critical += 1;
    else if (score >= 7) high += 1;
    else if (score >= 4) medium += 1;
    else low += 1;
  }

  return {
    buckets: [
      { label: "Low", count: low, color: RISK_COLORS.low },
      { label: "Medium", count: medium, color: RISK_COLORS.medium },
      { label: "High", count: high, color: RISK_COLORS.high },
      { label: "Critical", count: critical, color: RISK_COLORS.critical },
    ],
    scoredCount: low + medium + high + critical,
    unscoredCount: unscored,
  };
}

const RADIAN = Math.PI / 180;

function renderLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-xl bg-white p-3 sm:p-4 shadow-sm dark:bg-white/5 dark:border dark:border-white/15 dark:shadow-none">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-dark/50 dark:text-white/70">
          Ecosystem Health
        </h3>
        <p className="mt-0.5 text-xs text-surface-dark/40 dark:text-white/70">
          Risk across tracked projects
        </p>
      </div>
      {children}
    </div>
  );
}

/**
 * Risk distribution pie chart sourced from `GET /projects` and aggregated
 * client-side by `criticality_score`. Must render inside a Suspense
 * boundary (see `EcosystemHealthCardSkeleton`) and an ErrorBoundary
 * (see `EcosystemHealthCardFallback`).
 */
/**
 * Page size for the risk-distribution sample. Kept small to avoid a
 * large over-the-wire payload on first paint; once the backend adds a
 * dedicated aggregate endpoint (`INTEGRATION.md` gap G5) this becomes
 * a single request with exact totals.
 */
const RISK_SAMPLE_SIZE = 100;

/**
 * Dependency coverage = share of tracked dependency edges that are
 * routed through repos we know about (internal + external). Low values
 * mean large parts of the dependency graph are not yet indexed.
 *
 * Formula: `total_dependency_edges / (total_repos + total_external_repos)`,
 * capped at 100% since ratios can exceed 1 in fan-out scenarios.
 */
function computeCoveragePercent(metadata: MetadataResponse): number | null {
  const denominator =
    (metadata.total_repos ?? 0) + (metadata.total_external_repos ?? 0);
  if (denominator <= 0) return null;
  const raw = (metadata.total_dependency_edges ?? 0) / denominator;
  return Math.min(Math.round(raw * 100), 100);
}

export default function EcosystemHealthCard() {
  const { data } = useProjectsListSuspense({ limit: RISK_SAMPLE_SIZE });
  const { data: metadataData } = useMetadataSuspense();
  const metadata = metadataData as MetadataResponse;
  const distribution = useMemo(() => {
    const projects = (data?.items ?? []) as ProjectSummary[];
    return bucketProjects(projects);
  }, [data?.items]);
  const { buckets, scoredCount, unscoredCount } = distribution;
  const coveragePercent = useMemo(
    () => computeCoveragePercent(metadata),
    [metadata],
  );

  // When no project has a computed criticality score yet, rendering a
  // pie would be misleading (all slices would be zero or artificially
  // bucketed). Show a clear empty state instead — sized to match the
  // real pie chart so the card doesn't visually shrink.
  if (scoredCount === 0) {
    return (
      <CardShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div className="relative flex h-[130px] w-[130px] sm:h-[170px] sm:w-[170px] items-center justify-center rounded-full border-[22px] border-gray-100 dark:border-white/10">
            <span className="text-xs font-medium text-surface-dark/40 dark:text-white/40">
              —
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-surface-dark/60 dark:text-white/70">
              Risk scoring pending
            </p>
            <p className="text-xs text-surface-dark/40 dark:text-white/50">
              {unscoredCount.toLocaleString()} projects tracked, none scored yet
            </p>
          </div>
        </div>
      </CardShell>
    );
  }

  const pieData = buckets.map((b) => ({
    name: b.label,
    value: b.count,
    fill: b.color,
  }));

  return (
    <CardShell>
      <div className="flex flex-col">
        <div className="h-[160px] sm:h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius="85%"
                innerRadius="40%"
                dataKey="value"
                paddingAngle={2}
                stroke="none"
                animationDuration={700}
                label={renderLabel}
                labelLine={false}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Pie>
              <ReTooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value: unknown, name: unknown) => [
                  `${value}`,
                  String(name),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {buckets.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-1.5 text-sm text-surface-dark/60 dark:text-white/70"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                {b.label}
              </div>
            ))}
          </div>
          <span className="shrink-0 text-sm text-surface-dark/30 dark:text-white/20">
            {scoredCount}
          </span>
        </div>
        {coveragePercent != null && (
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 text-xs dark:border-white/10">
            <span className="text-surface-dark/50 dark:text-white/50">
              Dependency coverage
            </span>
            <span className="font-mono font-medium text-surface-dark/80 dark:text-white/80">
              {coveragePercent}%
            </span>
          </div>
        )}
      </div>
    </CardShell>
  );
}

/** Suspense fallback — themed pie placeholder + legend bars. */
export function EcosystemHealthCardSkeleton() {
  return (
    <CardShell>
      <div className="flex flex-col" aria-busy="true" aria-live="polite">
        <div className="flex h-[160px] sm:h-[200px] w-full items-center justify-center">
          <div className="relative h-[120px] w-[120px] sm:h-[150px] sm:w-[150px]">
            {/* `Skeleton` hardcodes `rounded-lg`, which Tailwind emits
                AFTER `rounded-full` in its utilities layer and would win
                the cascade — so we hand-roll a circular pulse div. */}
            <div className="h-full w-full animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="absolute inset-[30%] rounded-full bg-white dark:bg-surface-dark" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </CardShell>
  );
}

/** Error-state fallback — zero-value buckets so the card stays legible. */
export function EcosystemHealthCardFallback() {
  const buckets: RiskBucket[] = [
    { label: "Low", count: 0, color: RISK_COLORS.low },
    { label: "Medium", count: 0, color: RISK_COLORS.medium },
    { label: "High", count: 0, color: RISK_COLORS.high },
    { label: "Critical", count: 0, color: RISK_COLORS.critical },
  ];
  return (
    <CardShell>
      <div className="flex flex-col">
        <div className="flex h-[160px] sm:h-[200px] w-full items-center justify-center">
          <div className="relative h-[120px] w-[120px] sm:h-[150px] sm:w-[150px]">
            <div className="h-full w-full rounded-full bg-gray-100 dark:bg-white/5" />
            <div className="absolute inset-[30%] rounded-full bg-white dark:bg-surface-dark" />
            <div className="absolute inset-0 flex items-center justify-center text-xs text-surface-dark/40 dark:text-white/40">
              —
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {buckets.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-1.5 text-sm text-surface-dark/60 dark:text-white/70"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                {b.label}
              </div>
            ))}
          </div>
          <span className="shrink-0 text-sm text-surface-dark/30 dark:text-white/20">
            0
          </span>
        </div>
      </div>
    </CardShell>
  );
}
