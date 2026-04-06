import { Clock, ExternalLink, Github, HelpCircle } from "lucide-react";
import type { ProjectDetailResponse } from "@pg-atlas/data-sdk";

export function MetricsPanel({
  project,
}: {
  project: ProjectDetailResponse;
}) {
  const metrics = [
    {
      label: "Criticality",
      value: project.criticality_score,
      color: "border-l-red-300",
      tooltip:
        "Criticality score — a 0–10 measure of how load-bearing this project is for the ecosystem.",
      provenance: "PG Atlas",
    },
    {
      label: "Pony Factor",
      value: project.pony_factor,
      color: "border-l-amber-300",
      tooltip:
        "Pony factor — the minimum number of contributors whose departure would stall the project.",
      provenance: "PG Atlas",
    },
    {
      label: "Adoption Score",
      value: project.adoption_score,
      color: "border-l-emerald-300",
      tooltip: "Derived from stars, downloads, and forks across project repos.",
      provenance: "GitHub + deps.dev",
    },
  ] as const;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-4 text-base font-semibold text-surface-dark dark:text-white">
        Project metrics
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`rounded-xl border border-gray-100 border-l-4 ${m.color} bg-gray-50/50 p-5 dark:border-white/10 dark:bg-white/5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-wide text-surface-dark/60 dark:text-white/50">
                {m.label}
              </span>
              <div className="group relative flex items-center">
                <button
                  type="button"
                  aria-describedby={`tooltip-${m.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full p-0.5 text-surface-dark/30 transition-colors hover:text-surface-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-white/25 dark:hover:text-white/40"
                >
                  <HelpCircle className="h-4 w-4 cursor-help" aria-hidden="true" />
                </button>
                <div
                  id={`tooltip-${m.label.toLowerCase().replace(/\s+/g, "-")}`}
                  role="tooltip"
                  className="pointer-events-none absolute top-full right-0 z-50 mt-2 w-60 rounded-lg bg-surface-dark px-3 py-2 text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-white dark:text-surface-dark"
                >
                  {m.tooltip}
                </div>
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold text-surface-dark dark:text-white">
              {project.activity_status && <span
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${project.activity_status === "live"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60"
                  }`}
              >
                {project.activity_status}
              </span>}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${project.activity_status === "live"
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
                          Updated{" "}
                          {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
            </section>
            );
}
