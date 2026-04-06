import { Clock, GitBranch, Github, HelpCircle } from "lucide-react";
import type { RepoDetailResponse } from "@pg-atlas/data-sdk";

export function MetricsPanel({ repo }: { repo: RepoDetailResponse }) {
  const metrics = [
    {
      label: "Criticality",
      value: repo.criticality_score,
      color: "border-l-red-300",
      tooltip:
        "Criticality score — a 0-10 measure of how load-bearing this repo is for the ecosystem.",
      provenance: "PG Atlas",
    },
    {
      label: "Pony Factor",
      value: repo.pony_factor,
      color: "border-l-amber-300",
      tooltip:
        "Pony factor — the minimum number of contributors whose departure would stall the repo.",
      provenance: "PG Atlas",
    },
    {
      label: "Stars",
      value: repo.adoption_stars,
      color: "border-l-yellow-300",
      tooltip: "Total GitHub stars — a measure of community interest.",
      provenance: "GitHub",
    },
    {
      label: "Forks",
      value: repo.adoption_forks,
      color: "border-l-blue-300",
      tooltip:
        "Total GitHub forks — indicates how many developers have created their own copy.",
      provenance: "GitHub",
    },
    {
      label: "Downloads",
      value: repo.adoption_downloads,
      color: "border-l-emerald-300",
      tooltip:
        "Package download count — a direct measure of real-world adoption.",
      provenance: "deps.dev",
    },
  ] as const;

  const activeMetrics = metrics.filter((m) => m.value != null);
  const displayMetrics =
    activeMetrics.length > 0 ? activeMetrics : metrics.slice(0, 3);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-4 text-base font-semibold text-surface-dark dark:text-white">
        Repo metrics
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {displayMetrics.map((m) => (
          <div
            key={m.label}
            className={`rounded-xl border border-gray-100 border-l-4 ${m.color} bg-gray-50/50 p-5 dark:border-white/10 dark:bg-white/5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-wide text-surface-dark/60 dark:text-white/50">
                {m.label}
              </span>
              <div className="group relative">
                <HelpCircle className="h-4 w-4 cursor-help text-surface-dark/30 dark:text-white/25" />
                <div className="pointer-events-none absolute top-full right-0 mt-2 w-60 rounded-lg bg-surface-dark px-3 py-2 text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-surface-dark">
                  {m.tooltip}
                </div>
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold text-surface-dark dark:text-white">
              {m.value != null ? m.value.toLocaleString() : "\u2014"}
            </div>
            <div className="mt-2 text-sm text-surface-dark/40 dark:text-white/30">
              {m.provenance}
            </div>
          </div>
        ))}
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
