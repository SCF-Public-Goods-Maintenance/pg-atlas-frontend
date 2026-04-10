import { Clock } from "lucide-react";
import type { DashboardOverview } from "../../../services/dashboardService";

export default function HomeHeader({
  overview,
  isLoading,
}: {
  overview?: DashboardOverview;
  isLoading?: boolean;
}) {
  const lastUpdated = (() => {
    if (!overview?.lastComputed) return "—";
    const date = new Date(overview.lastComputed);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
  })();

  return (
    <div className="mb-3 relative shrink-0">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Clock
            className={`h-3.5 w-3.5 text-surface-dark/30 dark:text-white/20 ${isLoading ? "animate-pulse" : ""
              }`}
          />
          <span className="text-[10px] font-medium uppercase tracking-wider text-surface-dark/40 dark:text-white/40">
            Last refresh: <span className="text-surface-dark/60 dark:text-white/60">{lastUpdated}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
