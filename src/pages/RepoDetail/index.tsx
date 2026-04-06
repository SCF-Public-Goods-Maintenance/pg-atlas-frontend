import { Suspense } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowUpRight, FolderOpen, Users } from "lucide-react";
import type { RepoDetailResponse, RepoDependency } from "@pg-atlas/data-sdk";

import {
  useRepoDetailSuspense,
  useRepoDependsOnSuspense,
  useRepoHasDependentsSuspense,
} from "../../lib/api/queries/repos";

import { MetricsPanel } from "./components/MetricsPanel";
import { Breadcrumb } from "../../components/atoms/Breadcrumb";
import { DependenciesPanel } from "./components/DependenciesPanel";
import { RepoDetailSkeleton } from "./components/RepoDetailSkeleton";
import { ErrorBoundary } from "../../components/atoms/ErrorBoundary";
import { RepoDetailErrorFallback } from "./components/RepoDetailErrorFallback";

/* ── page shell ───────────────────────────────────────────── */

export default function RepoDetail() {
  const { canonicalId } = useParams({ from: "/repos/$canonicalId" });
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <RepoDetailErrorFallback
          canonicalId={canonicalId}
          error={error}
          onRetry={reset}
        />
      )}
    >
      <Suspense fallback={<RepoDetailSkeleton />}>
        <RepoDetailContent canonicalId={canonicalId} />
      </Suspense>
    </ErrorBoundary>
  );
}

/* ── main content ─────────────────────────────────────────── */

function RepoDetailContent({ canonicalId }: { canonicalId: string }) {
  const repoQuery = useRepoDetailSuspense(canonicalId);
  const dependsOnQuery = useRepoDependsOnSuspense(canonicalId);
  const hasDependentsQuery = useRepoHasDependentsSuspense(canonicalId);

  const repo = repoQuery.data as RepoDetailResponse;
  const dependsOn = (dependsOnQuery.data ?? []) as RepoDependency[];
  const hasDependents = (hasDependentsQuery.data ?? []) as RepoDependency[];

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          ...(repo.parent_project
            ? [
                {
                  label: repo.parent_project.display_name,
                  href: `/projects/${repo.parent_project.canonical_id}`,
                },
              ]
            : []),
          { label: repo.display_name },
        ]}
      />
      <h2 className="text-3xl font-bold text-surface-dark dark:text-white">
        {repo.display_name}
      </h2>
      <p className="mt-2 text-base text-surface-dark/70 dark:text-white/70">
        <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm dark:bg-white/10">
          {canonicalId}
        </code>
      </p>

      <div className="mt-6 no-scrollbar flex-1 min-h-0 space-y-5 overflow-auto">
        <MetricsPanel repo={repo} />
        {repo.parent_project && (
          <ParentProjectPanel parent={repo.parent_project} />
        )}
        {repo.contributors && repo.contributors.length > 0 && (
          <ContributorsPanel contributors={repo.contributors} />
        )}
        <DependenciesPanel
          dependsOn={dependsOn}
          hasDependents={hasDependents}
        />
      </div>
    </div>
  );
}

/* ── small inline panels ──────────────────────────────────── */

function ParentProjectPanel({
  parent,
}: {
  parent: { canonical_id: string; display_name: string };
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-4 text-base font-semibold text-surface-dark dark:text-white">
        Parent project
      </h3>
      <Link
        to="/projects/$canonicalId"
        params={{ canonicalId: parent.canonical_id }}
        className="group flex items-center gap-3 rounded-xl border border-gray-100 px-5 py-4 transition-colors hover:bg-gray-50 dark:border-white/15 dark:hover:bg-white/10"
      >
        <FolderOpen
          className="h-5 w-5 text-surface-dark/40 dark:text-white/40"
          aria-hidden="true"
        />
        <span className="text-base font-medium text-surface-dark dark:text-white">
          {parent.display_name}
        </span>
        <ArrowUpRight
          className="ml-auto h-5 w-5 text-surface-dark/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-white/30"
          aria-hidden="true"
        />
      </Link>
    </section>
  );
}

function ContributorsPanel({
  contributors,
}: {
  contributors: Array<{ id: number; name: string; email_hash: string }>;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Contributors
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-surface-dark/60 dark:bg-white/10 dark:text-white/50">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {contributors.length}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {contributors.map((c) => (
          <Link
            key={c.id}
            to="/contributors/$id"
            params={{ id: String(c.id) }}
            className="group flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 transition-colors hover:bg-gray-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-base font-medium text-surface-dark dark:text-white">
                {c.name}
              </span>
            </div>
            <ArrowUpRight
              className="h-5 w-5 text-surface-dark/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-white/30"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
