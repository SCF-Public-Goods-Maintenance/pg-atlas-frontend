/**
 * Contributors feature — TanStack Query hooks wrapping @pg-atlas/data-sdk.
 *
 * Key convention: ["contributors", action, ...params]
 */
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  getContributor,
  listContributors,
  type ListContributorsData,
} from "@pg-atlas/data-sdk";
import { client } from "../client";

type ListContributorsQuery = NonNullable<ListContributorsData["query"]>;

export const contributorKeys = {
  all: ["contributors"] as const,
  lists: () => [...contributorKeys.all, "list"] as const,
  list: (params: ListContributorsQuery) =>
    [...contributorKeys.lists(), params] as const,
  details: () => [...contributorKeys.all, "detail"] as const,
  detail: (contributorId: number) =>
    [...contributorKeys.details(), contributorId] as const,
};

/* ── list ──────────────────────────────────────────────── */

async function fetchContributorsList(query: ListContributorsQuery) {
  const { data } = await listContributors({
    client,
    query,
    throwOnError: true,
  });
  return data;
}

/**
 * Paginated contributor list with optional case-insensitive name search.
 * Use inside a `<Suspense>` boundary.
 */
export function useContributorsListSuspense(
  query: ListContributorsQuery = {},
) {
  return useSuspenseQuery({
    queryKey: contributorKeys.list(query),
    queryFn: () => fetchContributorsList(query),
  });
}

export function useContributorsList(query: ListContributorsQuery = {}) {
  return useQuery({
    queryKey: contributorKeys.list(query),
    queryFn: () => fetchContributorsList(query),
  });
}

/* ── detail ────────────────────────────────────────────── */

async function fetchContributor(contributorId: number) {
  const { data } = await getContributor({
    client,
    path: { contributor_id: contributorId },
    throwOnError: true,
  });
  return data;
}

/**
 * Single contributor profile with per-repo contribution breakdown.
 * Use inside a `<Suspense>` boundary.
 */
export function useContributorDetailSuspense(contributorId: number) {
  return useSuspenseQuery({
    queryKey: contributorKeys.detail(contributorId),
    queryFn: () => fetchContributor(contributorId),
  });
}

export function useContributorDetail(contributorId: number) {
  return useQuery({
    queryKey: contributorKeys.detail(contributorId),
    queryFn: () => fetchContributor(contributorId),
    enabled: Number.isFinite(contributorId),
  });
}
