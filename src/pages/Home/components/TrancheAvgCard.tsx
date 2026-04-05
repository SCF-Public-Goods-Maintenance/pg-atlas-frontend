import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import type { TrancheAvgCardProps } from "../../../types";

export default function TrancheAvgCard({ overview }: TrancheAvgCardProps) {
  const trancheDistribution = overview?.headline.trancheDistribution;
  const average = overview?.headline.averageTrancheCompletion;

  return (
    <div className="flex flex-1 min-h-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-white/5 dark:border-white/15">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-dark/50 dark:text-white/70">
        Tranche Avg
      </h3>
      <p className="mt-1 text-2xl font-bold text-surface-dark dark:text-white">
        {average != null ? `${(average * 100).toFixed(0)}%` : "—"}
      </p>
      {trancheDistribution && trancheDistribution.length > 0 && (
        <div className="mt-2 flex-1 min-h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trancheDistribution} barCategoryGap="15%">
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} animationDuration={500}>
                {trancheDistribution.map((d) => (
                  <Cell key={d.label} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
