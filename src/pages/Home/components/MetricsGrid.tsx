import React from "react";
import { Database, FolderGit2, Link2, Users } from "lucide-react";
import type { MetadataResponse } from "@pg-atlas/data-sdk";
import { useMetadataSuspense } from "../../../lib/api/queries/metadata";
import { Skeleton } from "../../../components/atoms/Skeleton";

const CARD_CLASS =
  "flex flex-col justify-between rounded-xl bg-white p-3 sm:p-4 shadow-sm dark:border dark:border-white/15 dark:bg-white/5 dark:shadow-none min-h-[140px]";

/**
 * Headline metric cards consolidated from `GET /metadata`.
 * Desktop: 2-column layout (Combined Stats on left, Edge Metrics on right).
 * Mobile: Vertical stack for Projects/Repos, Side-by-side row for Edges.
 * Must render inside a `<Suspense fallback={<MetricsGridSkeleton />}>` boundary.
 */
export default function MetricsGrid() {
  const { data } = useMetadataSuspense();
  const metadata = data as MetadataResponse;

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {/* Column 1: Projects & Repos (Always Stacked) */}
      <div className="flex flex-col gap-3">
        {/* Projects Card */}
        <div className={CARD_CLASS}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-dark/45 dark:text-white/70">
              Projects
            </h3>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
              <FolderGit2
                className="h-3.5 w-3.5 text-surface-dark/40 dark:text-white/60"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <p
              className="mt-1.5 sm:mt-2 truncate text-2xl sm:text-3xl font-bold text-surface-dark dark:text-white"
              title={`${metadata.active_projects.toLocaleString()} / ${metadata.total_projects.toLocaleString()}`}
            >
              {metadata.active_projects.toLocaleString()}
              <span className="mx-2 text-surface-dark/20 dark:text-white/20 font-light">
                /
              </span>
              {metadata.total_projects.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-surface-dark/35 dark:text-white/50">
              Active / Total tracked
            </p>
          </div>
        </div>

        {/* Repositories Card */}
        <div className={CARD_CLASS}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-dark/45 dark:text-white/70">
              Repositories
            </h3>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
              <Database
                className="h-3.5 w-3.5 text-surface-dark/40 dark:text-white/60"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <p
              className="mt-1.5 sm:mt-2 truncate text-2xl sm:text-3xl font-bold text-surface-dark dark:text-white"
              title={`${metadata.total_repos.toLocaleString()} | ${metadata.total_external_repos.toLocaleString()}`}
            >
              {metadata.total_repos.toLocaleString()}
              <span className="mx-2 text-surface-dark/20 dark:text-white/20 font-light">
                |
              </span>
              {metadata.total_external_repos.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-surface-dark/35 dark:text-white/50">
              Stellar | External •{" "}
              <span className="opacity-80">
                {metadata.active_repos_90d.toLocaleString()} active
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Column 2: Edge Metrics (Side-by-side on mobile, stacked on desktop) */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-col">
        {/* Dependency Edges Card */}
        <div className={CARD_CLASS}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-surface-dark/45 dark:text-white/70">
              <span className="sm:hidden">D Edges</span>
              <span className="hidden sm:inline">Dependency Edges</span>
            </h3>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
              <Link2
                className="h-3.5 w-3.5 text-surface-dark/40 dark:text-white/60"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-1 sm:gap-y-2">
            <p
              className="mt-1 sm:mt-2 truncate text-lg sm:text-3xl font-bold text-surface-dark dark:text-white"
              title={metadata.total_dependency_edges.toLocaleString()}
            >
              {metadata.total_dependency_edges.toLocaleString()}
            </p>
            <p className="hidden sm:block mt-1 text-sm text-surface-dark/35 dark:text-white/50">
              Total dependency links
            </p>
          </div>
        </div>

        {/* Contributor Edges Card */}
        <div className={CARD_CLASS}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-surface-dark/45 dark:text-white/70">
              <span className="sm:hidden">C Edges</span>
              <span className="hidden sm:inline">Contributor Edges</span>
            </h3>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
              <Users
                className="h-3.5 w-3.5 text-surface-dark/40 dark:text-white/60"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-1 sm:gap-y-2">
            <p
              className="mt-1 sm:mt-2 truncate text-lg sm:text-3xl font-bold text-surface-dark dark:text-white"
              title={metadata.total_contributor_edges.toLocaleString()}
            >
              {metadata.total_contributor_edges.toLocaleString()}
            </p>
            <p className="hidden sm:block mt-1 text-sm text-surface-dark/35 dark:text-white/50">
              Total contributor links
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricsGridFallback() {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <MetricCardPlaceholder
          label="Projects"
          icon={FolderGit2}
          desc="Active / Total tracked"
        />
        <MetricCardPlaceholder
          label="Repositories"
          icon={Database}
          desc="Stellar | External • 0 active"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-col">
        <MetricCardPlaceholder
          label="D Edges"
          desktopLabel="Dependency Edges"
          icon={Link2}
          desc="Total dependency links"
          mobilecompact
        />
        <MetricCardPlaceholder
          label="C Edges"
          desktopLabel="Contributor Edges"
          icon={Users}
          desc="Total contributor links"
          mobilecompact
        />
      </div>
    </div>
  );
}

function MetricCardPlaceholder({
  label,
  desktopLabel,
  icon: Icon,
  desc,
  mobilecompact = false,
}: {
  label: string;
  desktopLabel?: string;
  icon: React.ElementType;
  desc: string;
  mobilecompact?: boolean;
}) {
  return (
    <div className={CARD_CLASS}>
      <div className="flex items-center justify-between">
        <h3
          className={`${mobilecompact ? "text-xs sm:text-sm" : "text-sm"} font-semibold uppercase tracking-wide text-surface-dark/45 dark:text-white/70`}
        >
          {desktopLabel ? (
            <>
              <span className="sm:hidden">{label}</span>
              <span className="hidden sm:inline">{desktopLabel}</span>
            </>
          ) : (
            label
          )}
        </h3>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/10">
          <Icon
            className="h-3.5 w-3.5 text-surface-dark/40 dark:text-white/60"
            aria-hidden="true"
          />
        </div>
      </div>
      <p
        className={`${mobilecompact ? "mt-1" : "mt-1.5"} sm:mt-2 font-bold text-surface-dark/30 dark:text-white/40 ${
          mobilecompact ? "text-lg sm:text-3xl" : "text-2xl sm:text-3xl"
        }`}
      >
        0
      </p>
      <p
        className={`mt-1 text-xs text-surface-dark/35 dark:text-white/50 ${mobilecompact ? "hidden sm:block" : ""}`}
      >
        {desc}
      </p>
    </div>
  );
}

export function MetricsGridSkeleton() {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <MetricSkeletonCard />
        <MetricSkeletonCard />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-col">
        <MetricSkeletonCard />
        <MetricSkeletonCard />
      </div>
    </div>
  );
}

function MetricSkeletonCard() {
  return (
    <div className={CARD_CLASS}>
      <div className="flex items-center justify-between">
        <div className="flex h-5 items-center">
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <div className="mt-2 flex h-9 items-center">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="mt-1 flex h-5 items-center">
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}
