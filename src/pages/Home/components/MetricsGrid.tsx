import React from "react";
import {
  Activity,
  Database,
  ExternalLink,
  FolderGit2,
  Link2,
  Users,
} from "lucide-react";
import type { MetadataResponse } from "@pg-atlas/data-sdk";
import { useMetadataSuspense } from "../../../lib/api/queries/metadata";
import { Skeleton } from "../../../components/atoms/Skeleton";

type MetricKey =
  | "total_projects"
  | "active_projects"
  | "total_repos"
  | "total_external_repos"
  | "total_dependency_edges"
  | "total_contributor_edges";

const METRIC_CARDS: ReadonlyArray<{
  key: MetricKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}> = [
  {
    key: "total_projects",
    label: "Total Projects",
    icon: FolderGit2,
    desc: "Tracked in ecosystem",
  },
  {
    key: "active_projects",
    label: "Active Projects",
    icon: Activity,
    desc: "Currently active",
  },
  {
    key: "total_repos",
    label: "Total Repos",
    icon: Database,
    desc: "Internal repositories",
  },
  {
    key: "total_external_repos",
    label: "External Repos",
    icon: ExternalLink,
    desc: "External repositories",
  },
  {
    key: "total_dependency_edges",
    label: "Dependency Edges",
    icon: Link2,
    desc: "Total dependency links",
  },
  {
    key: "total_contributor_edges",
    label: "Contributor Edges",
    icon: Users,
    desc: "Total contributor links",
  },
];

const CARD_CLASS =
  "flex flex-col justify-between rounded-xl bg-white p-3 sm:p-4 shadow-sm dark:border dark:border-white/15 dark:bg-white/5 dark:shadow-none";

/**
 * Headline metric cards sourced from `GET /metadata`.
 * Must render inside a `<Suspense fallback={<MetricsGridSkeleton />}>` boundary.
 */
export default function MetricsGrid() {
  const { data } = useMetadataSuspense();
  const metadata = data as MetadataResponse;

  return (
    <div className="md:col-span-2 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3">
      {METRIC_CARDS.map((card) => {
        const Icon = card.icon;
        const value = metadata[card.key];
        return (
          <div key={card.key} className={CARD_CLASS}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-dark/45 dark:text-white/70">
                {card.label}
              </h3>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
                <Icon
                  className="h-3.5 w-3.5 text-surface-dark/40 dark:text-white/60"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <p className="mt-1.5 sm:mt-2 truncate text-2xl sm:text-3xl font-bold text-surface-dark dark:text-white">
                {value != null ? value.toLocaleString() : "—"}
              </p>

              <p className="mt-1 text-sm text-surface-dark/35 dark:text-white/50">
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MetricsGridFallback() {
  return (
    <div
      className="md:col-span-2 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3"
      aria-label="Headline metrics (unavailable)"
    >
      {METRIC_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className={CARD_CLASS}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-surface-dark/45 dark:text-white/70">
                {card.label}
              </h3>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
                <Icon
                  className="h-3.5 w-3.5 text-surface-dark/40 dark:text-white/60"
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-surface-dark/30 dark:text-white/40">
              0
            </p>
            <p className="mt-1 text-xs text-surface-dark/35 dark:text-white/50">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function MetricsGridSkeleton() {
  return (
    <div
      className="md:col-span-2 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: METRIC_CARDS.length }).map((_, i) => (
        <div key={i} className={CARD_CLASS}>
          <div className="flex items-center justify-between">
            <div className="flex h-5 items-center">
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
          <div className="mt-2 flex h-9 items-center">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mt-1 flex h-5 items-center">
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
