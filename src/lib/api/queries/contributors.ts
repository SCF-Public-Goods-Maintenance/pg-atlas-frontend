/**
 * Contributors feature — TanStack Query hooks wrapping @pg-atlas/data-sdk.
 *
 * Key convention: ["contributors", action, ...params]
 */
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getContributor } from "@pg-atlas/data-sdk";
import { client } from "../client";

export const contributorKeys = {
  all: ["contributors"] as const,
  details: () => [...contributorKeys.all, "detail"] as const,
  detail: (contributorId: number) =>
    [...contributorKeys.details(), contributorId] as const,
};

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
