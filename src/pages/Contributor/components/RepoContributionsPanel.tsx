import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, GitBranch } from "lucide-react";
import type { ContributorDetailResponse } from "@pg-atlas/data-sdk";

export function RepoContributionsPanel({
  repos,
}: {
  repos: ContributorDetailResponse["repos"];
}) {
  const groupedRepos = useMemo(() => {
    const sortedRepos = [...repos].sort(
      (a, b) =>
        new Date(b.last_commit_date).getTime() -
        new Date(a.last_commit_date).getTime()
    );

    const groups = new Map<string, typeof repos>();
    const maxDates = new Map<string, number>();

    for (const r of sortedRepos) {
      const pid = r.project_canonical_id || "Standalone Repositories";
      if (!groups.has(pid)) {
        groups.set(pid, []);
        maxDates.set(pid, 0);
      }
      groups.get(pid)!.push(r);
      const commitTime = new Date(r.last_commit_date).getTime();
      if (commitTime > maxDates.get(pid)!) {
        maxDates.set(pid, commitTime);
      }
    }

    return Array.from(groups.entries()).sort(
      (a, b) => maxDates.get(b[0])! - maxDates.get(a[0])!
    );
  }, [repos]);

  if (repos.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Repo contributions
        </h3>
        <p className="mt-4 rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-surface-dark/50 dark:border-white/10 dark:text-white/40">
          No repo contributions found for this contributor.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Repo contributions
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-surface-dark/60 dark:bg-white/10 dark:text-white/50">
          <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
          {repos.length}
        </span>
      </div>
      <div className="mt-4 space-y-6">
        {groupedRepos.map(([projectId, projectRepos]) => (
          <div key={projectId} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              {projectId !== "Standalone Repositories" ? (
                <Link
                  to="/projects/$canonicalId"
                  params={{ canonicalId: projectId }}
                  className="group flex items-center gap-2 text-sm font-semibold text-surface-dark hover:text-primary-500 dark:text-white"
                >
                  {projectId}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ) : (
                <span className="text-sm font-semibold text-surface-dark dark:text-white">
                  {projectId}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {projectRepos.map((r) => (
                <Link
                  key={r.repo_canonical_id}
                  to="/repos/$canonicalId"
                  params={{ canonicalId: r.repo_canonical_id }}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 transition-colors hover:bg-gray-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <GitBranch
                      className="h-5 w-5 text-surface-dark/40 dark:text-white/40"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-base font-medium text-surface-dark dark:text-white">
                        {r.repo_display_name}
                      </div>
                      <div className="mt-0.5 text-sm text-surface-dark/50 dark:text-white/40">
                        {r.number_of_commits} commit
                        {r.number_of_commits === 1 ? "" : "s"}
                        {" · "}
                        {new Date(r.first_commit_date).toLocaleDateString()} –{" "}
                        {new Date(r.last_commit_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 text-surface-dark/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-white/30"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
