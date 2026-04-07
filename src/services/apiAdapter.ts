import type { DashboardOverview } from './dashboardService'
import { getMetadata, listProjects, type ProjectSummary } from '@pg-atlas/data-sdk'
import type { RoundProjectData, RoundDetail, RoundEnrichedProject } from '../types/rounds'

import { rounds, roundList } from '../data/rounds'

/**
 * Fetches real ecosystem stats + projects from the Live API.
 */
export async function getLiveDashboardData(): Promise<Partial<DashboardOverview>> {
  try {
    const { data: metaData, error: metaErr } = await getMetadata()
    if (metaErr || !metaData) return {}

    const { data: projectsData, error: projErr } = await listProjects({ query: { limit: 5000 } })
    if (projErr || !projectsData) return {}
    
    // The dashboard metrics are now purely based on the live API metadata.
    // Awarded/Tranche metrics are removed as they are not currently in the backend.

    return {
      lastComputed: metaData.last_updated || '2026-04-01T00:00:16.366169Z',
      metadataSummary: metaData,
      headline: {
        totalProjects: metaData.total_projects,
        activeProjects: metaData.active_projects,
        totalRepos: metaData.total_repos,
        totalExternalRepos: metaData.total_external_repos,
        totalDependencyEdges: metaData.total_dependency_edges,
        totalContributorEdges: metaData.total_contributor_edges,
      } as DashboardOverview['headline'],
      currentRound: (() => {
        const latest = roundList[0]
        if (!latest) return undefined
        return {
          roundId: `${latest.year}Q${latest.quarter}`,
          title: latest.name,
          proposalsCount: latest.projects.length,
          category: 'Public Goods',
        }
      })(),
      roundsIndex: roundList.map((r) => ({
        roundId: `${r.year}Q${r.quarter}`,
        label: `${r.year} Q${r.quarter}`,
        isCurrent: r === roundList[0]
      })),
    }
  } catch (e) {
    // If API fails, return empty to fallback to pure mock
    return {}
  }
}

/**
 * Filter projects from the round data.
 * Cross-references with the live API if a canonical_id is present.
 */
export async function getProjectsForRound(roundId: string): Promise<RoundDetail | null> {
  const round = rounds[roundId]
  if (!round) return null

  let dbProjects: ProjectSummary[] = []
  try {
    const { data } = await listProjects({ query: { limit: 5000 } })
    if (data && data.items) {
      dbProjects = data.items
    }
  } catch (e) {
    // Ignore API errors, will fallback to empty db map
  }

  const dbMap = new Map<string, ProjectSummary>(dbProjects.map((p) => [p.canonical_id, p]))

  const mappedProjects: RoundEnrichedProject[] = round.projects.map((p: RoundProjectData) => {
    const dbProject = p.canonical_id ? dbMap.get(p.canonical_id) : null

    if (dbProject) {
      return {
        ...dbProject,
        display_name: p.name,
      } as RoundEnrichedProject
    }

    return {
      canonical_id: p.canonical_id || `proposal:${slugify(p.name)}`,
      display_name: p.name,
      project_type: 'scf-project',
      activity_status: 'in-dev',
      category: null,
      git_owner_url: null,
      pony_factor: null,
      criticality_score: null,
      adoption_score: null,
      updated_at: new Date().toISOString(),
      metadata: {
        scf_submissions: [{ round: `${round.year}Q${round.quarter}`, title: p.name }],
      }
    } as RoundEnrichedProject
  })

  return {
    ...round,
    projects: mappedProjects
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
