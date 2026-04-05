import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Github,
  ShieldCheck,
  Telescope,
} from "lucide-react";
import type { HomeHeaderProps } from "../../../types";

const SOURCE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  GitHub: Github,
  "deps.dev": ExternalLink,
  OpenGrants: ShieldCheck,
  "PG Atlas": Telescope,
};

export default function HomeHeader({ overview }: HomeHeaderProps) {
  return (
    <div className="mb-3 relative shrink-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-surface-dark/50 dark:text-white/50 shrink-0">
            Data sources
          </span>
          {overview?.dataTransparency.sources.map((s) => {
            const SourceIcon = SOURCE_ICONS[s.label] ?? ExternalLink;
            return (
              <div
                key={s.label}
                className="group relative inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-surface-dark/70 dark:border-white/15 dark:bg-white/5 dark:text-white/70"
              >
                <SourceIcon className="h-2.5 w-2.5" aria-hidden="true" />
                {s.label}
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-surface-dark px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-surface-dark">
                  {s.description}
                </div>
              </div>
            );
          })}
          {overview?.dataTransparency.processingNotes &&
            overview.dataTransparency.processingNotes.length > 0 && (
              <details className="inline-flex">
                <summary className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-xs font-medium text-surface-dark/50 hover:text-surface-dark/70 dark:border-white/15 dark:text-white/40 dark:hover:text-white/60 transition-colors">
                  +{overview.dataTransparency.processingNotes.length} notes
                </summary>
                <div className="absolute left-0 right-0 mt-2 z-10 rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-white/15 dark:bg-surface-dark">
                  <ul className="space-y-1 text-xs text-surface-dark/60 dark:text-white/60">
                    {overview.dataTransparency.processingNotes.map((n) => (
                      <li key={n} className="list-disc ml-4">
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-surface-dark/60 dark:bg-white/5 dark:border-white/15 dark:text-white/60">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {overview
              ? new Date(overview.lastComputed).toLocaleString()
              : "—"}
          </div>
          <Link
            to="/rounds/$roundId"
            params={{
              roundId: String(overview?.currentRound.roundId ?? "2026Q1"),
            }}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600 transition-colors focus:outline-none"
          >
            Current round
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
