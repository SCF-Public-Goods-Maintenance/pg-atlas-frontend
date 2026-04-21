import {
  AlertTriangle,
  Clock,
  Download,
  GitBranch,
  GitFork,
  Github,
  Star,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";
import type { RepoDetailResponse } from "@pg-atlas/data-sdk";
import type { Metric } from "../../../types";

const CARD_CLASS =
  "flex flex-col justify-between rounded-xl bg-white p-3 sm:p-4 shadow-sm dark:border dark:border-white/15 dark:bg-white/5 dark:shadow-none";

export function MetricsPanel({ repo }: { repo: RepoDetailResponse }) {
  const metrics: Metric[] = [
    {
      label: "Active Contributors (30d)",
      value: repo.active_contributors_30d,
      icon: UserCheck,
      provenance: "PG Atlas",
    },
    {
      label: "Active Contributors (90d)",
      value: repo.active_contributors_90d,
      icon: UsersRound,
      provenance: "PG Atlas",
    },
    {
      label: "Criticality",
      value: repo.criticality_score,
      icon: AlertTriangle,
      provenance: "PG Atlas",
    },
    {
      label: "Pony Factor",
      value: repo.pony_factor,
      icon: Users,
      provenance: "PG Atlas",
    },
    {
      label: "Stars",
      value: repo.adoption_stars,
      icon: Star,
      provenance: "GitHub",
    },
    {
      label: "Forks",
      value: repo.adoption_forks,
      icon: GitFork,
      provenance: "GitHub",
    },
    {
      label: "Downloads",
      value: repo.adoption_downloads,
      icon: Download,
      provenance: "deps.dev",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-4 text-base font-semibold text-surface-dark dark:text-white">
        Repo metrics
      </h3>
      <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
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
              <p className="mt-1.5 sm:mt-2 truncate text-2xl sm:text-3xl font-bold text-surface-dark dark:text-white">
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
        <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-surface-dark/70 dark:border-white/15 dark:text-white/60">
          {repo.visibility}
        </span>
        {repo.latest_version && (
          <span className="rounded-full border border-gray-200 px-3 py-1.5 text-sm font-mono text-surface-dark/70 dark:border-white/15 dark:text-white/60">
            v{repo.latest_version}
          </span>
        )}
        {repo.repo_url && (
          <a
            href={repo.repo_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-surface-dark/70 transition-colors hover:bg-gray-50 dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        )}
      </div>

      {(repo.latest_commit_date || repo.updated_at) && (
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-5 dark:border-white/10">
          {repo.latest_commit_date && (
            <span className="inline-flex items-center gap-1.5 text-sm text-surface-dark/50 dark:text-white/40">
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              Last commit{" "}
              {new Date(repo.latest_commit_date).toLocaleDateString()}
            </span>
          )}
          {repo.updated_at && (
            <span className="inline-flex items-center gap-1.5 text-sm text-surface-dark/50 dark:text-white/40">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Updated {new Date(repo.updated_at).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
