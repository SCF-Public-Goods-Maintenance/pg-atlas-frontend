import { Suspense } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { GitLogArtifactDetailResponse } from "@pg-atlas/data-sdk";
import { useGitlogArtifactDetailSuspense } from "../../lib/api/queries/gitlog";
import { ErrorBoundary } from "../../components/atoms/ErrorBoundary";
import { Breadcrumb } from "../../components/atoms/Breadcrumb";
import { Skeleton } from "../../components/atoms/Skeleton";
import { StatusBadge } from "../GitlogArtifacts/components/StatusBadge";

export default function GitlogArtifactDetail() {
  const { artifactId } = useParams({ from: "/gitlog/$artifactId" });
  const parsed = Number.parseInt(artifactId, 10);

  if (!Number.isFinite(parsed)) {
    return <InvalidIdFallback />;
  }

  return (
    <ErrorBoundary fallback={<DetailErrorFallback />}>
      <Suspense fallback={<DetailSkeleton />}>
        <DetailContent artifactId={parsed} />
      </Suspense>
    </ErrorBoundary>
  );
}

function DetailContent({ artifactId }: { artifactId: number }) {
  const { data } = useGitlogArtifactDetailSuspense(artifactId);
  const artifact = data as GitLogArtifactDetailResponse;

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Gitlog Artifacts", href: "/gitlog" },
          { label: `#${artifact.id}` },
        ]}
      />
      <div className="mt-2 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-surface-dark dark:text-white">
          Artifact #{artifact.id}
        </h2>
        <StatusBadge status={artifact.status} />
      </div>

      <div className="mt-6 no-scrollbar flex-1 min-h-0 space-y-5 overflow-auto">
        <MetaPanel artifact={artifact} />
        {artifact.error_detail && (
          <ErrorDetailPanel error={artifact.error_detail} />
        )}
        <RawArtifactPanel raw={artifact.raw_artifact} />
      </div>
    </div>
  );
}

function MetaPanel({ artifact }: { artifact: GitLogArtifactDetailResponse }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-4 text-base font-semibold text-surface-dark dark:text-white">
        Metadata
      </h3>
      <dl className="grid gap-4 sm:grid-cols-2">
        <MetaRow label="Repo">
          <Link
            to="/repos/$canonicalId"
            params={{ canonicalId: artifact.repo_canonical_id }}
            className="font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            {artifact.repo_display_name}
          </Link>
        </MetaRow>
        <MetaRow label="Repo canonical_id">
          <code className="font-mono text-xs">{artifact.repo_canonical_id}</code>
        </MetaRow>
        <MetaRow label="Artifact path">
          <code className="font-mono text-xs break-all">
            {artifact.artifact_path ?? "—"}
          </code>
        </MetaRow>
        <MetaRow label="Since (months)">{artifact.since_months}</MetaRow>
        <MetaRow label="Submitted at">
          {new Date(artifact.submitted_at).toLocaleString()}
        </MetaRow>
        <MetaRow label="Processed at">
          {artifact.processed_at
            ? new Date(artifact.processed_at).toLocaleString()
            : "—"}
        </MetaRow>
      </dl>
    </section>
  );
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-surface-dark/45 dark:text-white/50">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-surface-dark dark:text-white">
        {children}
      </dd>
    </div>
  );
}

function ErrorDetailPanel({ error }: { error: string }) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-500/30 dark:bg-red-500/5">
      <h3 className="mb-2 text-base font-semibold text-red-700 dark:text-red-300">
        Error detail
      </h3>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white p-3 font-mono text-xs text-red-800 dark:bg-red-500/10 dark:text-red-200">
        {error}
      </pre>
    </section>
  );
}

function RawArtifactPanel({ raw }: { raw: string | null | undefined }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <h3 className="mb-3 text-base font-semibold text-surface-dark dark:text-white">
        Raw artifact
      </h3>
      {raw ? (
        <pre className="max-h-[60vh] overflow-auto whitespace-pre rounded-lg bg-gray-50 p-3 font-mono text-xs text-surface-dark dark:bg-white/5 dark:text-white/80">
          {raw}
        </pre>
      ) : (
        <p className="text-sm text-surface-dark/50 dark:text-white/50">
          No raw artifact content available for this attempt.
        </p>
      )}
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <Skeleton className="h-8 w-48" />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-white/15 dark:bg-white/5">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-white/15 dark:bg-white/5">
        <Skeleton className="mb-3 h-4 w-32" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}

function DetailErrorFallback() {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white/40 p-10 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-medium text-surface-dark/60 dark:text-white/60">
        Unable to load this artifact
      </p>
      <Link
        to="/gitlog"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to artifacts
      </Link>
    </div>
  );
}

function InvalidIdFallback() {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white/40 p-10 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-medium text-surface-dark/60 dark:text-white/60">
        Invalid artifact id
      </p>
      <Link
        to="/gitlog"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to artifacts
      </Link>
    </div>
  );
}
