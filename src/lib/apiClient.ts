import type {
  MetadataResponse,
  ProjectDetailResponse,
  RepoDetailResponse,
} from '../types/api'

// `import.meta.env` typing can vary depending on the TS/ESLint setup.
// Cast once here so the rest of the client stays strongly typed.
const env = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
const API_BASE_URL = env?.VITE_API_BASE_URL ?? '/api/v1'

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  return (await response.json()) as T
}

export async function getMetadata(): Promise<MetadataResponse> {
  const response = await fetch(`${API_BASE_URL}/metadata`)
  return readJson<MetadataResponse>(response)
}

import { getProjectsForRound } from '../mocks/liveApiMock'

export async function getRoundProjects(roundId: string): Promise<any> {
  return getProjectsForRound(roundId)
}


export async function getProjectDetail(canonicalId: string): Promise<ProjectDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/projects/${canonicalId}`)
  return readJson<ProjectDetailResponse>(response)
}

export async function getContributorDetail(): Promise<never> {
  throw new Error('Contributor endpoints are not defined in api.md v0 yet.')
}

export async function getRepoDetail(repoCanonicalId: string): Promise<RepoDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/repos/${repoCanonicalId}`)
  return readJson<RepoDetailResponse>(response)
}
