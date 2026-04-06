import type { DashboardOverviewMock } from './dashboardOverviewMock'
import type { ProjectSummary, RoundProjectData, RoundDetail, MetadataSummary } from '../types/api'
import liveDataRaw from './liveApiMock.json'

interface LiveApiDump {
  summary: MetadataSummary
  projects: Record<string, unknown>[]
}

const liveData = liveDataRaw as unknown as LiveApiDump
import { rounds, roundList } from '../data/rounds'

/**
 * Bridges the gap between the raw DB Dump JSON and the existing Dashboard UI.
 * This allows the UI to use "Honest Data" from your local database if it exists.
 */
export async function getLiveDashboardData(): Promise<Partial<DashboardOverviewMock>> {
  // Use data from the local dump if it has been synced
  const hasSyncData = liveData && liveData.summary && liveData.summary.total_nodes > 0

  if (!hasSyncData) {
    return {} // Return empty to trigger fallback to the existing mock
  }

  const rawProjects = liveData.projects || []
  const projects = rawProjects.map((p) => ({
    ...p,
    git_org_url: p.git_org_url || p.git_owner_url || '',
    criticality_score: p.criticality_score || 0,
    pony_factor: p.pony_factor || 0,
    adoption_score: p.adoption_score || 0,
    updated_at: sanitizeDate(p.updated_at as string | undefined)
  })) as ProjectSummary[]

  const awardedProjects = projects.filter((p) => p.metadata?.scf_awarded === true || p.metadata?.scf_awarded === 'yes')

  const totalAwarded = awardedProjects.length
  // Sum each awarded project's scf_tranche_completion (0.0 to 1.0)
  const totalCompletion = awardedProjects.reduce((acc: number, p) => acc + (p.metadata?.scf_tranche_completion || 0), 0)
  // averageCompletion = totalCompletion / totalAwarded
  // e.g. 3 projects with completions [1.0, 0.5, 0.33] → sum 1.83 / 3 = 0.61 (61%)
  const averageCompletion = totalAwarded > 0 ? (totalCompletion / totalAwarded) : 0

  return {
    lastComputed: '2026-04-01T00:00:16.366169Z',
    metadataSummary: {
      total_nodes: liveData.summary.total_nodes,
      total_edges: liveData.summary.total_edges,
      active_count: liveData.summary.active_count,
      last_full_recompute: '2026-04-01T00:00:16.366169Z',
    },
    headline: {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.activity_status === 'live' || p.activity_status === 'active').length,
      totalRepos: liveData.summary.total_nodes,
      totalExternalRepos: 0,
      totalDependencyEdges: liveData.summary.total_edges,
      totalContributorEdges: 0,
      totalAwardedProjects: totalAwarded,
      averageTrancheCompletion: averageCompletion,
      trancheDistribution: (() => {
        const buckets = [
          { label: '0%', min: -1, max: 0, color: '#ef4444' },
          { label: '1-33%', min: 0, max: 0.33, color: '#f97316' },
          { label: '34-66%', min: 0.33, max: 0.66, color: '#eab308' },
          { label: '67-99%', min: 0.66, max: 0.99, color: '#84cc16' },
          { label: '100%', min: 0.99, max: 1.01, color: '#10b981' },
        ]
        return buckets.map((b) => ({
          label: b.label,
          value: awardedProjects.filter((p) => {
            const val = p.metadata?.scf_tranche_completion || 0
            return val > b.min && val <= b.max
          }).length,
          color: b.color
        }))
      })()
    } as DashboardOverviewMock['headline'],
    currentRound: (() => {
      const latest = roundList[0]
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
}

/**
 * Filter projects from the round data.
 * Cross-references with the DB dump if a canonical_id is present.
 */
export async function getProjectsForRound(roundId: string): Promise<RoundDetail | null> {
  const round = rounds[roundId]
  if (!round) return null

  const rawProjects = liveData.projects || []
  const dbProjects = rawProjects.map((p) => ({
    ...p,
    git_org_url: p.git_org_url || p.git_owner_url || '',
    criticality_score: p.criticality_score || 0,
    pony_factor: p.pony_factor || 0,
    adoption_score: p.adoption_score || 0,
    updated_at: sanitizeDate(p.updated_at as string | undefined)
  })) as ProjectSummary[]

  const dbMap = new Map<string, ProjectSummary>(dbProjects.map((p) => [p.canonical_id, p]))

  const mappedProjects: ProjectSummary[] = round.projects.map((p: RoundProjectData) => {
    const dbProject = p.canonical_id ? dbMap.get(p.canonical_id) : null

    if (dbProject) {
      return {
        ...dbProject,
        display_name: p.name,
        metadata: {
          ...(dbProject.metadata || {}),
          scf_awarded: p.awarded,
          scf_tranche_completion: p.tranche_completion
        }
      }
    }

    return {
      canonical_id: p.canonical_id || `proposal:${slugify(p.name)}`,
      display_name: p.name,
      project_type: 'proposal',
      activity_status: 'in-dev',
      criticality_score: 0,
      pony_factor: 0,
      adoption_score: 0,
      git_org_url: '',
      metadata: {
        scf_submissions: [{ round: `${round.year}Q${round.quarter}`, title: p.name }],
        scf_awarded: p.awarded,
        scf_tranche_completion: p.tranche_completion
      }
    }
  })

  return {
    ...round,
    projects: mappedProjects
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/**
 * Ensures a date string is parseable by adding a '+' sign before timezone offsets 
 * that are missing a sign (e.g., '00:00' -> '+00:00'). 
 * This is a common issue with some DB dump ISO formats.
 */
function sanitizeDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  // If it ends with 00:00 and no sign, prepend a '+' to make it a valid ISO offset
  if (dateStr.includes('T') && /00:00$/.test(dateStr) && !/[+-]/.test(dateStr.slice(-6))) {
    return dateStr.replace(/00:00$/, '+00:00')
  }
  return dateStr
}

