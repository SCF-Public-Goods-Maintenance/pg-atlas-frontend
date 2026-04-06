import { Link } from "@tanstack/react-router";
import { Trophy, ArrowRight, Award, ShieldCheck, Clock } from "lucide-react";
import { roundList } from "../../../data/rounds";

/**
 * Horizontal "current round spotlight" strip rendered between the page
 * header and the first row of cards. Pulls the most recent round from
 * `src/data/rounds/*.json` and surfaces proposal/awarded counts + CTA.
 *
 * All data is static (round config), so no Suspense / skeleton is needed.
 */
export default function CurrentRoundSpotlight() {
  const current = roundList[0];
  if (!current) return <CurrentRoundSpotlightFallback />;

  const roundId = `${current.year}Q${current.quarter}`;
  const proposals = current.projects.length;
  const awarded = current.projects.filter((p) => {
    if (typeof p.awarded === "boolean") return p.awarded;
    return p.awarded === "yes";
  }).length;
  const ineligible = current.projects.filter(
    (p) => p.awarded === "ineligible",
  ).length;

  return (
    <div className="mb-4 shrink-0 rounded-2xl border border-primary-500/20 bg-gradient-to-r from-primary-50 via-white to-white p-4 shadow-sm dark:border-primary-500/30 dark:from-primary-500/10 dark:via-white/5 dark:to-white/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-500">
                Current round
              </span>
              <span className="text-xs text-surface-dark/50 dark:text-white/50">
                {roundId}
              </span>
            </div>
            <h3 className="mt-0.5 text-base font-semibold text-surface-dark dark:text-white">
              {current.name}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <SpotlightStat
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Proposals"
            value={proposals}
          />
          <SpotlightStat
            icon={<Award className="h-3.5 w-3.5 text-emerald-500" />}
            label="Awarded"
            value={awarded}
          />
          {ineligible > 0 && (
            <SpotlightStat
              icon={<ShieldCheck className="h-3.5 w-3.5 text-red-500" />}
              label="Ineligible"
              value={ineligible}
            />
          )}
          {current.voting_closed && (
            <div className="hidden items-center gap-1.5 text-xs text-surface-dark/50 dark:text-white/50 sm:flex">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Voting closed {current.voting_closed}
            </div>
          )}

          <Link
            to="/rounds/$roundId"
            params={{ roundId }}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600 focus:outline-none"
          >
            View round
            <ArrowRight
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SpotlightStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="font-mono text-sm font-semibold text-surface-dark dark:text-white">
        {value.toLocaleString()}
      </span>
      <span className="text-xs text-surface-dark/50 dark:text-white/50">
        {label}
      </span>
    </div>
  );
}

/** Renders when the round config is empty (e.g. wiped for a new cycle). */
export function CurrentRoundSpotlightFallback() {
  return (
    <div className="mb-4 shrink-0 rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-center text-xs text-surface-dark/50 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-white/50">
      No active round configured.
    </div>
  );
}
