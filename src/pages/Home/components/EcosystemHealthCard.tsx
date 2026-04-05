import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import type { EcosystemHealthCardProps, PieLabelRenderProps } from "../../../types";

const RADIAN = Math.PI / 180;

function renderLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: PieLabelRenderProps) {
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

export default function EcosystemHealthCard({ overview }: EcosystemHealthCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-white/5 dark:border-white/15 min-h-[280px]">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-dark/50 dark:text-white/70">
          Ecosystem Health
        </h3>
        <p className="mt-0.5 text-xs text-surface-dark/40 dark:text-white/70">
          Risk across tracked projects
        </p>
      </div>
      {overview?.riskDistribution &&
        (() => {
          const total = overview.riskDistribution.reduce(
            (s, b) => s + b.count,
            0,
          );
          const pieData = overview.riskDistribution.map((b) => ({
            name: b.label,
            value: b.count,
            fill: b.color,
          }));
          return (
            <div className="flex flex-col">
              <div className="w-full h-[200px]">
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
                      formatter={(value, name) => [`${value ?? 0} projects`, `${name}`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {overview.riskDistribution.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-1.5 text-sm text-surface-dark/60 dark:text-white/70"
                    >
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: b.color }}
                      />
                      {b.label}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-surface-dark/30 dark:text-white/20 shrink-0">
                  {total}
                </span>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
