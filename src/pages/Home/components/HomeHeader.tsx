import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { roundList } from "../../../data/rounds";
import type { DashboardOverview } from "../../../services/dashboardService";

const FALLBACK_ROUND_ID = "2026Q1";

function getCurrentRoundId(): string {
  const current = roundList[0];
  if (!current) return FALLBACK_ROUND_ID;
  return `${current.year}Q${current.quarter}`;
}

export default function HomeHeader({
  overview,
  isLoading,
}: {
  overview?: DashboardOverview;
  isLoading?: boolean;
}) {
  const currentRoundId = getCurrentRoundId();
  const lastUpdated = overview?.lastComputed
    ? new Date(overview.lastComputed).toLocaleString()
    : "—";

  return (
    <div className="mb-3 relative shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock
            className={`h-3.5 w-3.5 text-surface-dark/30 dark:text-white/20 ${
              isLoading ? "animate-pulse" : ""
            }`}
          />
          <span className="text-[10px] font-medium uppercase tracking-wider text-surface-dark/40 dark:text-white/40">
            Last refresh: <span className="text-surface-dark/60 dark:text-white/60">{lastUpdated}</span>
          </span>
        </div>
        <Link
          to="/rounds/$roundId"
          params={{ roundId: currentRoundId }}
          className="group inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
        >
          Current round
          <ArrowRight
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
