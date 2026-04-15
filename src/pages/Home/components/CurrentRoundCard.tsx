import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, FolderKanban, RotateCw, Vote } from "lucide-react";
import Button from "../../../components/atoms/Button";
import { roundListMeta, type RoundMeta } from "../../../data/rounds";

function formatVotingDate(dateStr?: string | Date): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg bg-surface-dark/[0.03] px-3 py-2.5 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-surface-dark/40 dark:text-white/35">
          {label}
        </p>
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-50 dark:bg-white/10">
          <Icon
            className="h-3 w-3 text-surface-dark/40 dark:text-white/60"
            aria-hidden="true"
          />
        </div>
      </div>
      <p className="mt-1.5 truncate text-lg font-bold text-surface-dark dark:text-white sm:text-xl">
        {value}
      </p>
    </div>
  );
}

export default function CurrentRoundCard({ roundMeta }: { roundMeta?: RoundMeta }) {
  const round = roundMeta ?? roundListMeta[0];
  const roundId = round.id;
  const quarter = round.quarter;
  const year = round.year;
  const projectCount = round.projectCount ?? 0;
  const votingClosed = formatVotingDate(round.voting_closed);
  const totalRounds = roundListMeta.length;

  const isCurrent = roundId === roundListMeta[0].id;

  const isVotingOpen = (() => {
    if (!round.voting_closed) return true; // Assume open if no close date
    const closeDate = new Date(round.voting_closed);
    return !Number.isNaN(closeDate.getTime()) && closeDate > new Date();
  })();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl bg-white p-4 sm:p-5 shadow-sm dark:bg-white/5 dark:border dark:border-white/15 dark:shadow-none">

      {/* Watermark quarter number */}
      <span
        className="pointer-events-none absolute -right-3 -top-4 select-none text-[120px] font-black leading-none text-surface-dark/[0.03] dark:text-white/[0.03]"
        aria-hidden="true"
      >
        Q{quarter}
      </span>

      {/* Gradient glow behind icon */}
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-primary-500/15 blur-2xl"
        aria-hidden="true"
      />

      {/* Top: badge + live indicator */}
      <div className="relative flex items-center justify-between">
        {isCurrent ? (
          <span className="rounded-md bg-primary-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-500 ring-1 ring-inset ring-primary-500/20 dark:text-primary-400 dark:ring-primary-400/20">
            Current Round
          </span>
        ) : (
          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-surface-dark/60 ring-1 ring-inset ring-surface-dark/10 dark:bg-white/10 dark:text-white/60 dark:ring-white/15">
            Previous Round
          </span>
        )}
        {isVotingOpen && isCurrent && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            </span>
            Live
          </span>
        )}
      </div>

      {/* Title block */}
      <div className="relative mt-4">
        <h3 className="text-2xl font-extrabold tracking-tight text-surface-dark dark:text-white sm:text-3xl">
          Q{quarter}{" "}
          <span className="text-surface-dark/30 dark:text-white/25">{year}</span>
        </h3>
        <p className="mt-1 text-sm font-medium text-surface-dark/55 dark:text-white/50">
          {round.name ?? "Public Goods Award"}
        </p>
      </div>

      {/* Stats row */}
      <div className="relative mt-auto pt-5">
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="Projects" value={projectCount || "—"} icon={FolderKanban} />
          <StatTile label="Rounds" value={totalRounds} icon={RotateCw} />
          <StatTile label="Voted" value={votingClosed ?? "—"} icon={Vote} />
        </div>
      </div>

      {/* CTA footer */}
      <div className="relative mt-4">
        <Link
          to="/rounds/$roundId"
          params={{ roundId }}
        >
          <Button
            as="span"
            icon={
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            }
          >
            View round details
          </Button>
        </Link>
      </div>
    </div>
  );
}
