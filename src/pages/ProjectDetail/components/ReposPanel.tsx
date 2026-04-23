import { Link } from "@tanstack/react-router";
import { ArrowUpRight, FolderGit2, GitBranch } from "lucide-react";
import type { RepoSummary } from "@pg-atlas/data-sdk";

export function ReposPanel({ repos }: { repos: RepoSummary[] }) {
  const sortedRepos = [...repos].sort(
    (a, b) =>
      new Date(b.latest_commit_date ?? 0).getTime() -
      new Date(a.latest_commit_date ?? 0).getTime(),
  );

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Associated repos
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-surface-dark/60 dark:bg-white/10 dark:text-white/50">
          <FolderGit2 className="h-3.5 w-3.5" />
          {repos.length}
        </span>
      </div>
      {repos.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-surface-dark/50 dark:border-white/10 dark:text-white/40">
          No repos associated with this project yet.
        </p>
      ) : (
        <div className="no-scrollbar mt-3 max-h-[280px] divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-100 dark:divide-white/10 dark:border-white/10">
          {sortedRepos.map((r) => (
            <Link
              key={r.canonical_id}
              to="/repos/$canonicalId"
              params={{ canonicalId: r.canonical_id }}
              className="group flex items-center justify-between gap-3 px-4 py-2.5 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <GitBranch
                  className="h-4 w-4 shrink-0 text-surface-dark/30 dark:text-white/30"
                  aria-hidden="true"
                />
                <span
                  className="truncate text-sm font-medium text-surface-dark dark:text-white"
                  title={r.display_name}
                >
                  {r.display_name}
                </span>
                <span className="hidden shrink-0 text-xs text-surface-dark/40 dark:text-white/30 sm:inline">
                  {r.latest_version ? r.latest_version : r.visibility}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {r.adoption_stars != null && (
                  <span className="text-xs text-surface-dark/40 dark:text-white/30">
                    ★ {r.adoption_stars}
                  </span>
                )}
                {r.adoption_forks != null && (
                  <span className="hidden text-xs text-surface-dark/40 dark:text-white/30 sm:inline">
                    {r.adoption_forks} forks
                  </span>
                )}
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-surface-dark/20 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-white/20"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
