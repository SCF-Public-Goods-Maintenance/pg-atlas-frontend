import { Suspense } from "react";
import { useParams } from "@tanstack/react-router";
import type { ContributorDetailResponse } from "@pg-atlas/data-sdk";
import { useContributorDetailSuspense } from "../../lib/api/queries/contributors";
import { Breadcrumb } from "../../components/atoms/Breadcrumb";
import { ErrorBoundary } from "../../components/atoms/ErrorBoundary";
import { ProfilePanel } from "./components/ProfilePanel";
import { RepoContributionsPanel } from "./components/RepoContributionsPanel";
import { ContributorSkeleton } from "./components/ContributorSkeleton";
import { ContributorErrorFallback } from "./components/ContributorErrorFallback";

/* ── page shell ───────────────────────────────────────────── */

export default function Contributor() {
  const { id } = useParams({ from: "/contributors/$id" });
  const contributorId = Number(id);

  if (Number.isNaN(contributorId)) {
    return (
      <ContributorErrorFallback
        contributorId={id}
        error={new Error(`Invalid contributor ID: ${id}`)}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <ContributorErrorFallback
          contributorId={id}
          error={error}
          onRetry={reset}
        />
      )}
    >
      <Suspense fallback={<ContributorSkeleton />}>
        <ContributorContent contributorId={contributorId} />
      </Suspense>
    </ErrorBoundary>
  );
}

/* ── main content ─────────────────────────────────────────── */

function ContributorContent({ contributorId }: { contributorId: number }) {
  const { data } = useContributorDetailSuspense(contributorId);
  const contributor = data as ContributorDetailResponse;

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Contributors", href: "/contributors" },
          { label: contributor.name },
        ]}
      />
      <h2 className="text-3xl font-bold text-surface-dark dark:text-white">
        {contributor.name}
      </h2>
      <p className="mt-2 text-base text-surface-dark/70 dark:text-white/70">
        Contributor #{contributor.id}
      </p>

      <div className="mt-6 no-scrollbar flex-1 min-h-0 space-y-5 overflow-auto">
        <ProfilePanel contributor={contributor} />
        <RepoContributionsPanel repos={contributor.repos} />
      </div>
    </div>
  );
}
