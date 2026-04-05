import { Link } from "@tanstack/react-router";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import type { AwardHealthCardProps } from "../../../types";

const DONUT_COLORS = ["#10b981", "#e5e7eb"];

export default function AwardHealthCard({ overview }: AwardHealthCardProps) {
  const proposals = overview?.currentRound.proposalsCount ?? 0;
  const awarded = Math.min(
    overview?.headline.totalAwardedProjects ?? 0,
    proposals,
  );
  const remaining = Math.max(proposals - awarded, 0);
  const pct = proposals > 0 ? Math.round((awarded / proposals) * 100) : 0;
  const donutData = [
    { name: "Awarded", value: awarded },
    { name: "Remaining", value: remaining },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-white/5 dark:border-white/15">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
          Award Health
        </h3>
        <Link
          to="/rounds/$roundId"
          params={{
            roundId: String(overview?.currentRound.roundId ?? "2026Q1"),
          }}
          className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          {overview?.currentRound.roundId ?? "—"} →
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-full h-[180px]">
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
                formatter={(value, name) => [`${value ?? 0}`, `${name}`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-surface-dark dark:text-white">
              {pct}%
            </span>
            <span className="text-xs text-surface-dark/40 dark:text-white/70">
              awarded
            </span>
          </div>
        </div>
        <div className="w-full flex justify-center gap-4 pt-2 text-sm">
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
    </div>
  );
}
