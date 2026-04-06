/**
 * Repos feature — TanStack Query hooks wrapping @pg-atlas/data-sdk.
 *
 * Key convention: ["repos", action, ...params]
 */
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  listRepos,
  getRepo,
  getRepoDependsOn,
  getRepoHasDependents,
  type ListReposData,
} from "@pg-atlas/data-sdk";
import { client } from "../client";

type ListReposQuery = NonNullable<ListReposData["query"]>;

export const repoKeys = {
  all: ["repos"] as const,
  lists: () => [...repoKeys.all, "list"] as const,
  list: (params: ListReposQuery) => [...repoKeys.lists(), params] as const,
  details: () => [...repoKeys.all, "detail"] as const,
  detail: (canonicalId: string) =>
    [...repoKeys.details(), canonicalId] as const,
  dependsOn: (canonicalId: string) =>
    [...repoKeys.all, "depends-on", canonicalId] as const,
  hasDependents: (canonicalId: string) =>
    [...repoKeys.all, "has-dependents", canonicalId] as const,
};

/* ── list ──────────────────────────────────────────────── */

async function fetchReposList(query: ListReposQuery) {
  const { data } = await listRepos({
    client,
    query,
    throwOnError: true,
  });
  return data;
}

export function useReposListSuspense(query: ListReposQuery = {}) {
  return useSuspenseQuery({
    queryKey: repoKeys.list(query),
    queryFn: () => fetchReposList(query),
  });
}

export function useReposList(query: ListReposQuery = {}) {
  return useQuery({
    queryKey: repoKeys.list(query),
    queryFn: () => fetchReposList(query),
  });
}

/* ── detail ────────────────────────────────────────────── */

async function fetchRepo(canonicalId: string) {
  const { data } = await getRepo({
    client,
    path: { canonical_id: canonicalId },
    throwOnError: true,
  });
  return data;
}

export function useRepoDetailSuspense(canonicalId: string) {
  return useSuspenseQuery({
    queryKey: repoKeys.detail(canonicalId),
    queryFn: () => fetchRepo(canonicalId),
  });
}

export function useRepoDetail(canonicalId: string) {
  return useQuery({
    queryKey: repoKeys.detail(canonicalId),
    queryFn: () => fetchRepo(canonicalId),
    enabled: Boolean(canonicalId),
  });
}

/* ── depends-on ────────────────────────────────────────── */

async function fetchRepoDependsOn(canonicalId: string) {
  const { data } = await getRepoDependsOn({
    client,
    path: { canonical_id: canonicalId },
    throwOnError: true,
  });
  return data;
}

export function useRepoDependsOnSuspense(canonicalId: string) {
  return useSuspenseQuery({
    queryKey: repoKeys.dependsOn(canonicalId),
    queryFn: () => fetchRepoDependsOn(canonicalId),
  });
}

export function useRepoDependsOn(canonicalId: string) {
  return useQuery({
    queryKey: repoKeys.dependsOn(canonicalId),
    queryFn: () => fetchRepoDependsOn(canonicalId),
    enabled: Boolean(canonicalId),
  });
}

/* ── has-dependents ────────────────────────────────────── */

async function fetchRepoHasDependents(canonicalId: string) {
  const { data } = await getRepoHasDependents({
    client,
    path: { canonical_id: canonicalId },
    throwOnError: true,
  });
  return data;
}

export function useRepoHasDependentsSuspense(canonicalId: string) {
  return useSuspenseQuery({
    queryKey: repoKeys.hasDependents(canonicalId),
    queryFn: () => fetchRepoHasDependents(canonicalId),
  });
}

export function useRepoHasDependents(canonicalId: string) {
  return useQuery({
    queryKey: repoKeys.hasDependents(canonicalId),
    queryFn: () => fetchRepoHasDependents(canonicalId),
    enabled: Boolean(canonicalId),
  });
}
