import React from "react";
import {
  Activity,
  Database,
  ExternalLink,
  FolderGit2,
  Link2,
  Users,
} from "lucide-react";
import type { DashboardOverviewMock } from "../../../mocks/dashboardOverviewMock";
import type { MetricsGridProps } from "../../../types";

type MetricKey = keyof DashboardOverviewMock["headline"];

const METRIC_CARDS: ReadonlyArray<{
  key: MetricKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  desc: string;
}> = [
  {
    key: "totalProjects",
    label: "Total Projects",
    icon: FolderGit2,
    color: "border-l-primary-500",
    desc: "Tracked in ecosystem",
  },
  {
    key: "activeProjects",
    label: "Active Projects",
    icon: Activity,
    color: "border-l-emerald-500",
    desc: "Currently active",
  },
  {
    key: "totalRepos",
    label: "Total Repos",
    icon: Database,
    color: "border-l-blue-500",
    desc: "Internal repositories",
  },
  {
    key: "totalExternalRepos",
    label: "External Repos",
    icon: ExternalLink,
    color: "border-l-violet-500",
    desc: "External repositories",
  },
  {
    key: "totalDependencyEdges",
    label: "Dependency Edges",
    icon: Link2,
    color: "border-l-pink-500",
    desc: "Total dependency links",
  },
  {
    key: "totalContributorEdges",
    label: "Contributor Edges",
    icon: Users,
    color: "border-l-cyan-500",
    desc: "Total contributor links",
  },
];

export default function MetricsGrid({ overview }: MetricsGridProps) {
  return (
    <div className="lg:col-span-2 grid gap-3 grid-cols-2 md:grid-cols-3">
      {METRIC_CARDS.map((card) => {
        const Icon = card.icon;
        const value = overview
          ? (overview.headline[card.key] as number | undefined)
          : null;
        return (
          <div
            key={card.key}
            className={`rounded-2xl border border-gray-200 border-l-4 ${card.color} bg-white p-4 shadow-sm dark:border-white/15 dark:bg-white/5 dark:shadow-none`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wide text-surface-dark/50 dark:text-white/70">
                {card.label}
              </h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
                <Icon
                  className="h-4 w-4 text-surface-dark/60 dark:text-white/60"
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-surface-dark dark:text-white">
              {value != null ? value.toLocaleString() : "—"}
            </p>
            <p className="mt-1 text-sm text-surface-dark/40 dark:text-white/70">
              {card.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
