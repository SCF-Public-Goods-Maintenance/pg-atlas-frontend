import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import type { TopCriticalCardProps } from "../../../types";

export default function TopCriticalCard({ overview }: TopCriticalCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-white/5 dark:border-white/15">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp
            className="h-4 w-4 text-surface-dark/50 dark:text-white/40"
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
            Top Critical
          </h3>
        </div>
        {overview?.dependencyCoveragePercent != null && (
          <span className="text-xs text-surface-dark/40 dark:text-white/70">
            {overview.dependencyCoveragePercent}% coverage
          </span>
        )}
      </div>
      {overview?.topCriticalProjects && (
        <div className="flex-1 overflow-auto rounded-xl border border-gray-100 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="px-3 py-2 text-sm font-medium text-surface-dark/40 dark:text-white/70">
                  #
                </th>
                <th className="px-3 py-2 text-sm font-medium text-surface-dark/40 dark:text-white/70">
                  Project
                </th>
                <th className="px-3 py-2 text-sm font-medium text-surface-dark/40 dark:text-white/70 text-right">
                  Crit.
                </th>
                <th className="px-3 py-2 text-sm font-medium text-surface-dark/40 dark:text-white/70 text-right">
                  Pony
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {overview.topCriticalProjects.slice(0, 5).map((p, idx) => (
                <tr
                  key={p.canonical_id}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors"
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
                  <td className="px-3 py-2 text-right font-mono text-sm">
                    {p.criticality_score.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-sm">
                    {p.pony_factor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
