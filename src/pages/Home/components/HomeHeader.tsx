import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { roundList } from "../../../data/rounds";

const FALLBACK_ROUND_ID = "2026Q1";

function getCurrentRoundId(): string {
  const current = roundList[0];
  if (!current) return FALLBACK_ROUND_ID;
  return `${current.year}Q${current.quarter}`;
}

export default function HomeHeader() {
  const currentRoundId = getCurrentRoundId();

  return (
    <div className="mb-3 relative shrink-0">
      <div className="flex items-center justify-end">
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
