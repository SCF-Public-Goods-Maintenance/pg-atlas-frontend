/**
 * Projects feature — TanStack Query hooks wrapping @pg-atlas/data-sdk.
 *
 * Key convention: ["projects", action, ...params]
 */
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  listProjects,
  getProject,
  getProjectRepos,
  getProjectDependsOn,
  getProjectHasDependents,
  getProjectContributors,
  type ListProjectsData,
  type GetProjectReposData,
  type GetProjectContributorsData,
} from "@pg-atlas/data-sdk";
import { client } from "../client";

type ListProjectsQuery = NonNullable<ListProjectsData["query"]>;
type GetProjectReposQuery = NonNullable<GetProjectReposData["query"]>;
type GetProjectContributorsQuery = NonNullable<
  GetProjectContributorsData["query"]
>;

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (params: ListProjectsQuery) =>
    [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (canonicalId: string) =>
    [...projectKeys.details(), canonicalId] as const,
  repos: (canonicalId: string, params: GetProjectReposQuery = {}) =>
    [...projectKeys.all, "repos", canonicalId, params] as const,
  dependsOn: (canonicalId: string) =>
    [...projectKeys.all, "depends-on", canonicalId] as const,
  hasDependents: (canonicalId: string) =>
    [...projectKeys.all, "has-dependents", canonicalId] as const,
  contributors: (
    canonicalId: string,
    params: GetProjectContributorsQuery = {},
  ) => [...projectKeys.all, "contributors", canonicalId, params] as const,
};

/* ── list ──────────────────────────────────────────────── */

async function fetchProjectsList(query: ListProjectsQuery) {
  const { data } = await listProjects({
    client,
    query,
    throwOnError: true,
  });
  return data;
}

export function useProjectsListSuspense(query: ListProjectsQuery = {}) {
  return useSuspenseQuery({
    queryKey: projectKeys.list(query),
    queryFn: () => fetchProjectsList(query),
  });
}

export function useProjectsList(query: ListProjectsQuery = {}) {
  return useQuery({
    queryKey: projectKeys.list(query),
    queryFn: () => fetchProjectsList(query),
  });
}

/* ── detail ────────────────────────────────────────────── */

async function fetchProject(canonicalId: string) {
  const { data } = await getProject({
    client,
    path: { canonical_id: canonicalId },
    throwOnError: true,
  });

  return data;
}

export function useProjectDetailSuspense(canonicalId: string) {
  return useSuspenseQuery({
    queryKey: projectKeys.detail(canonicalId),
    queryFn: () => fetchProject(canonicalId),
  });
}

export function useProjectDetail(canonicalId: string) {
  return useQuery({
    queryKey: projectKeys.detail(canonicalId),
    queryFn: () => fetchProject(canonicalId),
    enabled: Boolean(canonicalId),
  });
}

/* ── repos ─────────────────────────────────────────────── */

async function fetchProjectRepos(
  canonicalId: string,
  query: GetProjectReposQuery,
) {
  const { data } = await getProjectRepos({
    client,
    query,
    throwOnError: true,
    path: { canonical_id: canonicalId },
  });

  return data;
}

export function useProjectReposSuspense(
  canonicalId: string,
  query: GetProjectReposQuery = {},
) {
  return useSuspenseQuery({
    queryKey: projectKeys.repos(canonicalId, query),
    queryFn: () => fetchProjectRepos(canonicalId, query),
  });
}

export function useProjectRepos(
  canonicalId: string,
  query: GetProjectReposQuery = {},
) {
  return useQuery({
    queryKey: projectKeys.repos(canonicalId, query),
    queryFn: () => fetchProjectRepos(canonicalId, query),
    enabled: Boolean(canonicalId),
  });
}

/* ── depends-on ────────────────────────────────────────── */

async function fetchProjectDependsOn(canonicalId: string) {
  const { data } = await getProjectDependsOn({
    client,
    path: { canonical_id: canonicalId },
    throwOnError: true,
  });
  return data;
}

export function useProjectDependsOnSuspense(canonicalId: string) {
  return useSuspenseQuery({
    queryKey: projectKeys.dependsOn(canonicalId),
    queryFn: () => fetchProjectDependsOn(canonicalId),
  });
}

export function useProjectDependsOn(canonicalId: string) {
  return useQuery({
    queryKey: projectKeys.dependsOn(canonicalId),
    queryFn: () => fetchProjectDependsOn(canonicalId),
    enabled: Boolean(canonicalId),
  });
}

/* ── has-dependents ────────────────────────────────────── */

async function fetchProjectHasDependents(canonicalId: string) {
  const { data } = await getProjectHasDependents({
    client,
    path: { canonical_id: canonicalId },
    throwOnError: true,
  });
  return data;
}

export function useProjectHasDependentsSuspense(canonicalId: string) {
  return useSuspenseQuery({
    queryKey: projectKeys.hasDependents(canonicalId),
    queryFn: () => fetchProjectHasDependents(canonicalId),
  });
}

export function useProjectHasDependents(canonicalId: string) {
  return useQuery({
    queryKey: projectKeys.hasDependents(canonicalId),
    queryFn: () => fetchProjectHasDependents(canonicalId),
    enabled: Boolean(canonicalId),
  });
}

/* ── contributors ──────────────────────────────────────── */

async function fetchProjectContributors(
  canonicalId: string,
  query: GetProjectContributorsQuery,
) {
  const { data } = await getProjectContributors({
    client,
    path: { canonical_id: canonicalId },
    query,
    throwOnError: true,
  });
  return data;
}

export function useProjectContributorsSuspense(
  canonicalId: string,
  query: GetProjectContributorsQuery = {},
) {
  return useSuspenseQuery({
    queryKey: projectKeys.contributors(canonicalId, query),
    queryFn: () => fetchProjectContributors(canonicalId, query),
  });
}

export function useProjectContributors(
  canonicalId: string,
  query: GetProjectContributorsQuery = {},
) {
  return useQuery({
    queryKey: projectKeys.contributors(canonicalId, query),
    queryFn: () => fetchProjectContributors(canonicalId, query),
    enabled: Boolean(canonicalId),
  });
}
