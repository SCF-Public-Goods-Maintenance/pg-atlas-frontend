import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { MetadataResponse } from "@pg-atlas/data-sdk";
import type { PieLabelRenderProps } from "../../../types";
import { useMetadataSuspense } from "../../../lib/api/queries/metadata";
import { Skeleton } from "../../../components/atoms/Skeleton";

function ActivityTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const color = (entry.payload as { fill?: string } | undefined)?.fill;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm dark:border-white/15 dark:bg-surface-dark">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-surface-dark/70 dark:text-white/80">
          {String(entry.name)}
        </span>
        <span className="font-semibold text-surface-dark dark:text-white">
          {Number(entry.value ?? 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

const ACTIVITY_COLORS = {
  active_repos_90d: "#6366f1",
  active_contributors_30d: "#10b981",
  active_contributors_90d: "#f59e0b",
} as const;

const ACTIVITY_SLICES: ReadonlyArray<{
  key: keyof typeof ACTIVITY_COLORS;
  label: string;
  color: string;
}> = [
  {
    key: "active_repos_90d",
    label: "Active Repos (90d)",
    color: ACTIVITY_COLORS.active_repos_90d,
  },
  {
    key: "active_contributors_30d",
    label: "Contributors (30d)",
    color: ACTIVITY_COLORS.active_contributors_30d,
  },
  {
    key: "active_contributors_90d",
    label: "Contributors (90d)",
    color: ACTIVITY_COLORS.active_contributors_90d,
  },
];

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
          Ecosystem Activity
        </h3>
        <p className="mt-0.5 text-xs text-surface-dark/40 dark:text-white/70">
          Active repos &amp; contributors
        </p>
      </div>
      {children}
    </div>
  );
}

export default function EcosystemHealthCard() {
  const { data: metadataData } = useMetadataSuspense();
  const metadata = metadataData as MetadataResponse;

  const pieData = ACTIVITY_SLICES.map((slice) => ({
    name: slice.label,
    value: metadata[slice.key],
    fill: slice.color,
  }));

  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <CardShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div className="relative flex h-[130px] w-[130px] sm:h-[170px] sm:w-[170px] items-center justify-center rounded-full border-[22px] border-gray-100 dark:border-white/10">
            <span className="text-xs font-medium text-surface-dark/40 dark:text-white/40">
              —
            </span>
          </div>
          <p className="text-sm font-medium text-surface-dark/60 dark:text-white/70">
            No activity data yet
          </p>
        </div>
      </CardShell>
    );
  }

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
              <ReTooltip content={<ActivityTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {ACTIVITY_SLICES.map((slice) => (
              <div
                key={slice.key}
                className="flex items-center gap-1.5 text-sm text-surface-dark/60 dark:text-white/70"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                {slice.label}
              </div>
            ))}
          </div>
          <span className="shrink-0 text-sm text-surface-dark/30 dark:text-white/20">
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </CardShell>
  );
}

export function EcosystemHealthCardSkeleton() {
  return (
    <CardShell>
      <div className="flex flex-col" aria-busy="true" aria-live="polite">
        <div className="flex h-[160px] sm:h-[200px] w-full items-center justify-center">
          <div className="relative h-[120px] w-[120px] sm:h-[150px] sm:w-[150px]">
            <div className="h-full w-full animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="absolute inset-[30%] rounded-full bg-white dark:bg-surface-dark" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
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

export function EcosystemHealthCardFallback() {
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
            {ACTIVITY_SLICES.map((slice) => (
              <div
                key={slice.key}
                className="flex items-center gap-1.5 text-sm text-surface-dark/60 dark:text-white/70"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                {slice.label}
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
