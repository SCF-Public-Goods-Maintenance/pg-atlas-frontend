import { Suspense } from "react";
import { useParams } from "@tanstack/react-router";
import type {
  ProjectDetailResponse,
  ProjectDependency,
  RepoSummary,
} from "@pg-atlas/data-sdk";
import {
  useProjectDetailSuspense,
  useProjectReposSuspense,
  useProjectDependsOnSuspense,
  useProjectHasDependentsSuspense,
} from "../../lib/api/queries/projects";
import { Breadcrumb } from "../../components/atoms/Breadcrumb";
import { ErrorBoundary } from "../../components/atoms/ErrorBoundary";
import { MetricsPanel } from "./components/MetricsPanel";
import { ReposPanel } from "./components/ReposPanel";
import { DependenciesPanel } from "./components/DependenciesPanel";
import { ProjectDetailSkeleton } from "./components/ProjectDetailSkeleton";
import { ProjectDetailErrorFallback } from "./components/ProjectDetailErrorFallback";

/* ── page shell with Suspense + ErrorBoundary ─────────────── */

export default function ProjectDetail() {
  const { canonicalId } = useParams({ from: "/projects/$canonicalId" });
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <ProjectDetailErrorFallback
          canonicalId={canonicalId}
          error={error}
          onRetry={reset}
        />
      )}
    >
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetailContent canonicalId={canonicalId} />
      </Suspense>
    </ErrorBoundary>
  );
}

/* ── main content ─────────────────────────────────────────── */

function ProjectDetailContent({ canonicalId }: { canonicalId: string }) {
  const projectQuery = useProjectDetailSuspense(canonicalId);
  const reposQuery = useProjectReposSuspense(canonicalId);
  const dependsOnQuery = useProjectDependsOnSuspense(canonicalId);
  const hasDependentsQuery = useProjectHasDependentsSuspense(canonicalId);

  const project = projectQuery.data as ProjectDetailResponse;
  const repos = (reposQuery.data?.items ?? []) as RepoSummary[];
  const dependsOn = (dependsOnQuery.data ?? []) as ProjectDependency[];
  const hasDependents = (hasDependentsQuery.data ?? []) as ProjectDependency[];

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: project.display_name },
        ]}
      />
      <h2 className="text-3xl font-bold text-surface-dark dark:text-white">
        {project.display_name}
      </h2>
      <p className="mt-2 text-base text-surface-dark/70 dark:text-white/70">
        <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm dark:bg-white/10">
          {canonicalId}
        </code>
      </p>

      <div className="mt-6 no-scrollbar flex-1 min-h-0 space-y-5 overflow-auto">
        <MetricsPanel project={project} />
        <ReposPanel repos={repos} />
        <DependenciesPanel
          dependsOn={dependsOn}
          hasDependents={hasDependents}
        />
        <ContributorsPanel />
      </div>
    </div>
  );
}

/* ── contributors (empty until backend ships endpoint) ────── */

function ContributorsPanel() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Contributors
        </h3>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-surface-dark/60 dark:bg-white/10 dark:text-white/50">
          0
        </span>
      </div>
    </section>
  );
}
