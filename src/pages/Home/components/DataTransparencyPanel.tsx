import React from "react";
import {
  ExternalLink,
  FileText,
  Github,
  Info,
  Layers,
  ShieldCheck,
  Telescope,
} from "lucide-react";
import { useMetadata } from "../../../lib/api/queries/metadata";
import { Skeleton } from "../../../components/atoms/Skeleton";

interface SourceEntry {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  kind: "canonical" | "derived" | "aggregated";
  href?: string;
}

/**
 * Explicit provenance for every data source the frontend surfaces.
 * `kind` distinguishes raw canonical records from values we compute
 * client-side or that the backend already aggregated — per the spec's
 * "canonical vs computed/aggregated labels" requirement.
 */
const SOURCES: ReadonlyArray<SourceEntry> = [
  {
    label: "GitHub",
    description:
      "Repository metadata, commit activity, stars/forks/downloads, and contributor history.",
    icon: Github,
    kind: "canonical",
    href: "https://github.com",
  },
  {
    label: "deps.dev",
    description:
      "Open-source dependency graph — used for the project / repo / external-repo dependency edges.",
    icon: ExternalLink,
    kind: "canonical",
    href: "https://deps.dev",
  },
  {
    label: "OpenGrants",
    description:
      "Stellar Community Fund submissions, tranche completions, and award decisions.",
    icon: ShieldCheck,
    kind: "canonical",
  },
  {
    label: "PG Atlas",
    description:
      "Internal criticality scoring, pony factor, and risk bucketing computed server-side from the above sources.",
    icon: Telescope,
    kind: "derived",
  },
];

/**
 * Processing notes shown inside the transparency panel. These describe
 * client-side derivations the user should be aware of when interpreting
 * the dashboard numbers. Sourced from the frontend itself so it stays
 * honest when the backend aggregates evolve.
 */
const PROCESSING_NOTES: ReadonlyArray<string> = [
  "Risk distribution on this page is aggregated client-side from a 100-project sample of `GET /projects`. Totals are indicative, not exact.",
  "Dependency coverage % is computed as `total_dependency_edges / (total_repos + total_external_repos)`.",
  "Round-scoped data (awarded, tranche, proposal counts) is curated in `src/data/rounds/*.json` and rendered at build time — the API has no `/rounds` endpoint yet.",
  "Criticality, pony factor, and adoption scores are sourced directly from the API and may be `null` until the backend computes them.",
];

function KindBadge({ kind }: { kind: SourceEntry["kind"] }) {
  const style = {
    canonical:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    derived:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    aggregated:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  }[kind];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style}`}
    >
      {kind}
    </span>
  );
}

/**
 * Narrow single-column transparency card — designed to sit as the third
 * column alongside the Top Critical and All Rounds tables in row 2 of
 * the dashboard. Sources stack on top, processing notes below, both
 * scrollable if the column runs out of vertical room.
 *
 * Static content + `/metadata.last_updated` timestamp; no suspense needed.
 */
export default function DataTransparencyPanel() {
  const { data: metadata, isLoading } = useMetadata();
  const lastUpdated = metadata?.last_updated
    ? new Date(metadata.last_updated).toLocaleString()
    : null;

  return (
    <section className="flex flex-col rounded-xl bg-white p-3 sm:p-4 shadow-sm dark:bg-white/5 dark:border dark:border-white/15 dark:shadow-none">
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Info
            className="h-4 w-4 text-surface-dark/50 dark:text-white/50"
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
            Data transparency
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-surface-dark/50 dark:text-white/50">
          <Layers className="h-3 w-3" aria-hidden="true" />
          <span>Last refreshed:</span>
          {isLoading ? (
            <Skeleton className="h-3 w-32" />
          ) : (
            <span className="truncate font-mono text-surface-dark/70 dark:text-white/70">
              {lastUpdated ?? "unknown"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex-1 space-y-4 overflow-auto">
        {/* Sources */}
        <div>
          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-surface-dark/50 dark:text-white/50">
            Sources
          </h4>
          <ul className="space-y-1.5">
            {SOURCES.map((s) => {
              const Icon = s.icon;
              const content = (
                <>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-surface-dark/70 dark:bg-white/10 dark:text-white/70">
                    <Icon className="h-3 w-3" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-xs font-medium text-surface-dark dark:text-white">
                        {s.label}
                      </span>
                      <KindBadge kind={s.kind} />
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-surface-dark/55 dark:text-white/55">
                      {s.description}
                    </p>
                  </div>
                </>
              );
              return (
                <li
                  key={s.label}
                  className="rounded-lg border border-gray-100 px-2.5 py-1.5 dark:border-white/10"
                >
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-start gap-2">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Processing notes */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-surface-dark/50 dark:text-white/50">
            <FileText className="h-3 w-3" aria-hidden="true" />
            Processing notes
          </h4>
          <ul className="space-y-1.5 text-[11px] leading-snug text-surface-dark/65 dark:text-white/55">
            {PROCESSING_NOTES.map((note) => (
              <li
                key={note}
                className="flex gap-2 rounded-lg border border-gray-100 px-2.5 py-1.5 dark:border-white/10"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary-500/60" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Error fallback — ultra-minimal so the panel never takes down the page. */
export function DataTransparencyPanelFallback() {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl bg-white p-5 text-center text-xs text-surface-dark/50 shadow-sm dark:bg-white/5 dark:border dark:border-white/15 dark:shadow-none dark:text-white/50">
      Data transparency panel is temporarily unavailable.
    </section>
  );
}
