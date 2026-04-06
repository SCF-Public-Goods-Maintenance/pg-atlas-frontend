import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  computeAverageTrancheCompletion,
  computeTrancheDistribution,
} from "../../../lib/trancheHelpers";
import { Skeleton } from "../../../components/atoms/Skeleton";

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 min-h-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-white/5 dark:border-white/15">
      {children}
    </div>
  );
}

/**
 * Tranche completion average + distribution histogram, computed from the
 * static round config via `lib/trancheHelpers`. No async, no Suspense.
 */
export default function TrancheAvgCard() {
  const average = useMemo(() => computeAverageTrancheCompletion(), []);
  const distribution = useMemo(() => computeTrancheDistribution(), []);

  const hasData = distribution.some((b) => b.value > 0);

  return (
    <CardShell>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-dark/50 dark:text-white/70">
        Tranche Avg
      </h3>
      <p className="mt-1 text-2xl font-bold text-surface-dark dark:text-white">
        {hasData ? `${(average * 100).toFixed(0)}%` : "—"}
      </p>
      {hasData ? (
        <div className="mt-2 flex-1 min-h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} barCategoryGap="15%">
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <Bar
                dataKey="value"
                radius={[3, 3, 0, 0]}
                animationDuration={500}
              >
                {distribution.map((d) => (
                  <Cell key={d.label} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-2 text-xs text-surface-dark/40 dark:text-white/50">
          No tranche data available yet.
        </p>
      )}
    </CardShell>
  );
}

/** Skeleton fallback — header text + bar chart bars. */
export function TrancheAvgCardSkeleton() {
  const barHeights = ["h-6", "h-8", "h-10", "h-12", "h-10"];
  return (
    <CardShell>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-1 h-6 w-16" />
      <div className="mt-2 flex flex-1 items-end gap-1">
        {barHeights.map((h, i) => (
          <Skeleton key={i} className={`flex-1 rounded-t-md ${h}`} />
        ))}
      </div>
    </CardShell>
  );
}

/** Error / empty fallback. */
export function TrancheAvgCardFallback() {
  return (
    <CardShell>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-dark/50 dark:text-white/70">
        Tranche Avg
      </h3>
      <p className="mt-1 text-2xl font-bold text-surface-dark/40 dark:text-white/40">
        —
      </p>
      <p className="mt-2 text-xs text-surface-dark/40 dark:text-white/50">
        Tranche data unavailable.
      </p>
    </CardShell>
  );
}
