/**
 * Gitlog artifacts feature — TanStack Query hooks wrapping @pg-atlas/data-sdk.
 *
 * Key convention: ["gitlog", action, ...params]
 *
 * Gitlog artifacts are records of `git log` processing attempts against
 * tracked repos. Surfaced as an ops/debug view so engineers can inspect
 * pending, processed, or failed ingest attempts.
 */
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  listGitlogArtifacts,
  getGitlogArtifact,
  type ListGitlogArtifactsData,
} from "@pg-atlas/data-sdk";
import { client } from "../client";

type ListGitlogArtifactsQuery = NonNullable<ListGitlogArtifactsData["query"]>;

export const gitlogKeys = {
  all: ["gitlog"] as const,
  lists: () => [...gitlogKeys.all, "list"] as const,
  list: (params: ListGitlogArtifactsQuery) =>
    [...gitlogKeys.lists(), params] as const,
  details: () => [...gitlogKeys.all, "detail"] as const,
  detail: (artifactId: number) =>
    [...gitlogKeys.details(), artifactId] as const,
};

/* ── list ──────────────────────────────────────────────── */

async function fetchGitlogArtifactsList(query: ListGitlogArtifactsQuery) {
  const { data } = await listGitlogArtifacts({
    client,
    query,
    throwOnError: true,
  });
  return data;
}

export function useGitlogArtifactsListSuspense(
  query: ListGitlogArtifactsQuery = {},
) {
  return useSuspenseQuery({
    queryKey: gitlogKeys.list(query),
    queryFn: () => fetchGitlogArtifactsList(query),
  });
}

export function useGitlogArtifactsList(
  query: ListGitlogArtifactsQuery = {},
) {
  return useQuery({
    queryKey: gitlogKeys.list(query),
    queryFn: () => fetchGitlogArtifactsList(query),
  });
}

/* ── detail ────────────────────────────────────────────── */

async function fetchGitlogArtifact(artifactId: number) {
  const { data } = await getGitlogArtifact({
    client,
    path: { artifact_id: artifactId },
    throwOnError: true,
  });
  return data;
}

export function useGitlogArtifactDetailSuspense(artifactId: number) {
  return useSuspenseQuery({
    queryKey: gitlogKeys.detail(artifactId),
    queryFn: () => fetchGitlogArtifact(artifactId),
  });
}

export function useGitlogArtifactDetail(artifactId: number) {
  return useQuery({
    queryKey: gitlogKeys.detail(artifactId),
    queryFn: () => fetchGitlogArtifact(artifactId),
    enabled: Number.isFinite(artifactId),
  });
}
