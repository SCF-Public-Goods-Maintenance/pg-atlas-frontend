import { Calendar, GitCommit } from "lucide-react";
import type { ContributorDetailResponse } from "@pg-atlas/data-sdk";

export function ProfilePanel({
  contributor,
}: {
  contributor: ContributorDetailResponse;
}) {
  const stats = [
    {
      label: "Total Repos",
      value: contributor.total_repos,
      color: "border-l-blue-300",
    },
    {
      label: "Total Commits",
      value: contributor.total_commits,
      color: "border-l-emerald-300",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center gap-4 mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-xl font-bold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          {contributor.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-surface-dark dark:text-white">
            {contributor.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-surface-dark/50 dark:text-white/40">
            {contributor.first_contribution && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Since{" "}
                {new Date(contributor.first_contribution).toLocaleDateString()}
              </span>
            )}
            {contributor.last_contribution && (
              <span className="inline-flex items-center gap-1.5">
                <GitCommit className="h-4 w-4" aria-hidden="true" />
                Last active{" "}
                {new Date(contributor.last_contribution).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border border-gray-100 border-l-4 ${s.color} bg-gray-50/50 p-5 dark:border-white/10 dark:bg-white/5`}
          >
            <span className="text-sm font-medium uppercase tracking-wide text-surface-dark/60 dark:text-white/50">
              {s.label}
            </span>
            <div className="mt-3 text-3xl font-bold text-surface-dark dark:text-white">
              {(s.value ?? 0).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
