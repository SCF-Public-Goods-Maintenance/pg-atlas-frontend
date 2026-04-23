import {
  AlertTriangle,
  Clock,
  ExternalLink,
  Github,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";
import type { Metric } from "../../../types";
import type { ProjectDetailResponse } from "@pg-atlas/data-sdk";

const CARD_CLASS =
  "flex flex-col justify-between rounded-xl bg-white p-3 sm:p-4 shadow-sm dark:border dark:border-white/15 dark:bg-white/5 dark:shadow-none";

export function MetricsPanel({ project }: { project: ProjectDetailResponse }) {
  const metrics: Metric[] = [
    {
      label: "Active Contributors (30d)",
      value: project.active_contributors_30d,
      icon: UserCheck,
      provenance: "PG Atlas",
    },
    {
      label: "Active Contributors (90d)",
      value: project.active_contributors_90d,
      icon: UsersRound,
      provenance: "PG Atlas",
    },
    {
      label: "Criticality",
      value: project.criticality_score,
      icon: AlertTriangle,
      provenance: "PG Atlas",
    },
    {
      label: "Pony Factor",
      value: project.pony_factor,
      icon: Users,
      provenance: "PG Atlas",
    },
    {
      label: "Adoption Score",
      value: project.adoption_score,
      icon: TrendingUp,
      provenance: "GitHub + deps.dev",
      format: "decimal",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-4 text-base font-semibold text-surface-dark dark:text-white">
        Project metrics
      </h3>
      <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={CARD_CLASS}>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-surface-dark/45 dark:text-white/70">
                  {m.label}
                </h4>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
                  <Icon
                    className="h-3.5 w-3.5 text-surface-dark/40 dark:text-white/60"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <p
                className="mt-1.5 sm:mt-2 truncate text-2xl sm:text-3xl font-bold text-surface-dark dark:text-white"
                title={
                  m.value != null
                    ? m.format === "decimal"
                      ? m.value.toFixed(2)
                      : Math.round(m.value).toLocaleString()
                    : "—"
                }
              >
                {m.value != null
                  ? m.format === "decimal"
                    ? m.value.toFixed(2)
                    : Math.round(m.value).toLocaleString()
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-surface-dark/35 dark:text-white/50">
                {m.provenance}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
            project.activity_status === "live"
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60"
          }`}
        >
          {project.activity_status}
        </span>
        <span className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-surface-dark/70 dark:border-white/15 dark:text-white/60">
          {project.category ?? "Uncategorized"}
        </span>
        {project.git_owner_url && (
          <a
            href={project.git_owner_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-surface-dark/70 transition-colors hover:bg-gray-50 dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        )}
      </div>

      {(project.metadata?.description ||
        project.metadata?.website ||
        project.metadata?.x_profile ||
        project.updated_at) && (
        <div className="mt-5 space-y-3 border-t border-gray-100 pt-5 dark:border-white/10">
          {project.metadata?.description && (
            <p className="text-base leading-relaxed text-surface-dark/80 dark:text-white/70">
              {project.metadata.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {project.metadata?.website && (
              <a
                href={project.metadata.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-surface-dark/70 transition-colors hover:bg-gray-50 dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            )}
            {project.metadata?.x_profile && (
              <a
                href={
                  project.metadata.x_profile.startsWith("http")
                    ? project.metadata.x_profile
                    : `https://x.com/${project.metadata.x_profile}`
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-surface-dark/70 transition-colors hover:bg-gray-50 dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
              >
                @
                {project.metadata.x_profile
                  .replace(/^https?:\/\/(twitter\.com|x\.com)\//, "")
                  .replace(/\/$/, "")}
              </a>
            )}
            {project.updated_at && (
              <span className="inline-flex items-center gap-1.5 text-sm text-surface-dark/50 dark:text-white/40">
                <Clock className="h-4 w-4" />
                Updated {new Date(project.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
