import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import { roundList } from "../../../data/rounds";
import { Skeleton } from "../../../components/atoms/Skeleton";

const DONUT_COLORS = ["#10b981", "#e5e7eb"];

interface Totals {
  roundId: string;
  proposals: number;
  awarded: number;
}

/**
 * Derive awarded-vs-proposals totals from the most recent entry in the
 * static round config. `awarded` supports both the string enum used by
 * the backend (`"yes" | "no" | "ineligible"`) and a boolean fallback.
 */
function computeTotals(): Totals | null {
  const current = roundList[0];
  if (!current) return null;

  const proposals = current.projects.length;
  const awarded = current.projects.filter((p) => {
    if (typeof p.awarded === "boolean") return p.awarded;
    return p.awarded === "yes";
  }).length;

  return {
    roundId: `${current.year}Q${current.quarter}`,
    proposals,
    awarded: Math.min(awarded, proposals),
  };
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-white/5 dark:border-white/15">
      {children}
    </div>
  );
}

function Header({ right }: { right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
        Award Health
      </h3>
      {right}
    </div>
  );
}

/**
 * Donut chart showing awarded vs total proposals for the current round,
 * sourced from `src/data/rounds/*.json`. Static data, no Suspense needed.
 */
export default function AwardHealthCard() {
  const totals = useMemo(() => computeTotals(), []);

  if (!totals || totals.proposals === 0) {
    return <AwardHealthCardFallback />;
  }

  const { roundId, proposals, awarded } = totals;
  const remaining = Math.max(proposals - awarded, 0);
  const pct = Math.round((awarded / proposals) * 100);
  const donutData = [
    { name: "Awarded", value: awarded },
    { name: "Remaining", value: remaining },
  ];

  return (
    <CardShell>
      <Header
        right={
          <Link
            to="/rounds/$roundId"
            params={{ roundId }}
            className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            {roundId} →
          </Link>
        }
      />
      <div className="flex flex-col items-center">
        <div className="relative h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
                animationDuration={700}
              >
                {donutData.map((_, idx) => (
                  <Cell key={idx} fill={DONUT_COLORS[idx]} />
                ))}
              </Pie>
              <ReTooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value: any, name: any) => [`${value}`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-surface-dark dark:text-white">
              {pct}%
            </span>
            <span className="text-xs text-surface-dark/40 dark:text-white/70">
              awarded
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center gap-4 pt-2 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-surface-dark/60 dark:text-white/70">
              {awarded} awarded
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-white/20" />
            <span className="text-surface-dark/60 dark:text-white/70">
              {proposals} total
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/** Skeleton fallback — matches the card layout for optional future use. */
export function AwardHealthCardSkeleton() {
  return (
    <CardShell>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="mt-2 flex flex-col items-center">
        <div className="relative flex h-[180px] w-full items-center justify-center">
          <div className="relative h-[140px] w-[140px]">
            <Skeleton className="h-full w-full rounded-full" />
            <div className="absolute inset-[30%] rounded-full bg-white dark:bg-surface-dark" />
          </div>
        </div>
        <div className="flex w-full justify-center gap-4 pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </CardShell>
  );
}

/** Error / empty fallback. */
export function AwardHealthCardFallback() {
  return (
    <CardShell>
      <Header />
      <div className="mt-2 flex flex-col items-center gap-2">
        <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full border-[18px] border-gray-100 dark:border-white/10">
          <span className="text-xs text-surface-dark/40 dark:text-white/40">
            —
          </span>
        </div>
        <p className="text-xs text-surface-dark/40 dark:text-white/50">
          Award data unavailable
        </p>
      </div>
    </CardShell>
  );
}
