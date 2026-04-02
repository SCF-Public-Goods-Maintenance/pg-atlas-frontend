import type { DashboardOverviewMock } from './dashboardOverviewMock'
import liveData from './liveApiMock.json'
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

  const rawProjects = (liveData as any).projects || []
  const projects = rawProjects.map((p: any) => ({
    ...p,
    updated_at: sanitizeDate(p.updated_at)
  }))
  const awardedProjects = projects.filter((p: any) => p.metadata?.scf_awarded === true)
  
  const totalAwarded = awardedProjects.length
  const totalCompletion = awardedProjects.reduce((acc: number, p: any) => acc + (p.metadata?.scf_tranche_completion || 0), 0)
  const averageCompletion = totalAwarded > 0 ? (totalCompletion / totalAwarded) : 0

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  
  return {
    lastComputed: tenMinutesAgo,
    metadataSummary: {
      total_nodes: liveData.summary.total_nodes,
      total_edges: liveData.summary.total_edges,
      active_count: liveData.summary.active_count,
      last_full_recompute: tenMinutesAgo,
    },
    headline: {
      totalProjects: projects.length,
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
        return buckets.map((b: any) => ({
          label: b.label,
          value: awardedProjects.filter((p: any) => {
            const val = p.metadata?.scf_tranche_completion || 0
            return val > b.min && val <= b.max
          }).length,
          color: b.color
        }))
      })()
    } as any,
    currentRound: (() => {
      const latest = roundList[0]
      return {
        roundId: `${latest.year}Q${latest.quarter}`,
        title: latest.name,
        proposalsCount: latest.projects.length,
        category: 'Public Goods',
      }
    })(),
    roundsIndex: roundList.map((r: any) => ({
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
export async function getProjectsForRound(roundId: string): Promise<any> {
  const round = rounds[roundId]
  if (!round) return null

  const rawProjects = (liveData as any).projects || []
  const dbProjects = rawProjects.map((p: any) => ({
    ...p,
    updated_at: sanitizeDate(p.updated_at)
  }))
  const dbMap = new Map(dbProjects.map((p: any) => [p.canonical_id, p]))

  const mappedProjects = round.projects.map((p: any) => {
    const dbProject = p.canonical_id ? dbMap.get(p.canonical_id) : null
    
    if (dbProject) {
      return {
        ...dbProject,
        display_name: p.name,
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
      metadata: {
        scf_submissions: [{ round: `${round.year}Q${round.quarter}`, title: p.name }]
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

