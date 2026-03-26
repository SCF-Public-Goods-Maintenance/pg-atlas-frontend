import type { MetadataResponse } from '../types/api'

export interface DashboardHeadlineMetrics {
  totalProjects: number
  totalRepos: number
  totalPublicGoods: number
  recentActivityPercent: number
  activeContributors30: number
  activeContributors90: number
  recentCommitVolume: number
  dataQualityCoveragePercent?: number
}

export interface DashboardRoundSpotlight {
  roundId: number
  title: string
  proposalsCount: number
  category: string
}

export interface DashboardOverviewMock {
  lastComputed: string
  metadataSummary: MetadataResponse['summary']
  headline: DashboardHeadlineMetrics
  currentRound: DashboardRoundSpotlight
  roundsIndex: Array<{ roundId: number; label: string; isCurrent: boolean }>
  dataTransparency: {
    sources: Array<{ label: string; description: string; provenance: string }>
    processingNotes: string[]
  }
}

export async function getMockDashboardOverview(): Promise<DashboardOverviewMock> {
  // Small delay so the UI has a realistic loading state.
  await new Promise((resolve) => setTimeout(resolve, 250))

  return {
    lastComputed: '2026-03-25T18:45:00Z',
    metadataSummary: {
      total_nodes: 412,
      total_edges: 1326,
      active_count: 287,
      last_full_recompute: '2026-03-25T18:30:00Z',
    },
    headline: {
      totalProjects: 168,
      totalRepos: 412,
      totalPublicGoods: 168,
      recentActivityPercent: 74,
      activeContributors30: 92,
      activeContributors90: 164,
      recentCommitVolume: 128_430,
      dataQualityCoveragePercent: 98,
    },
    currentRound: {
      roundId: 40,
      title: 'Stellar Community Fund - Public Goods Award (Round 40)',
      proposalsCount: 41,
      category: 'Governance + Infrastructure',
    },
    roundsIndex: [
      { roundId: 40, label: 'Round 40 (Current)', isCurrent: true },
      { roundId: 39, label: 'Round 39', isCurrent: false },
      { roundId: 38, label: 'Round 38', isCurrent: false },
    ],
    dataTransparency: {
      sources: [
        {
          label: 'GitHub',
          description: 'Repo metadata + commit activity windows for adoption signals.',
          provenance: 'GitHub',
        },
        {
          label: 'deps.dev',
          description: 'Dependency edges and within-ecosystem graph boundaries.',
          provenance: 'deps.dev',
        },
        {
          label: 'OpenGrants',
          description: 'SCF round/category linkages and tranche completion indicators.',
          provenance: 'OpenGrants',
        },
        {
          label: 'PG Atlas',
          description: 'Computed criticality, pony factor, and adoption scores.',
          provenance: 'PG Atlas',
        },
      ],
      processingNotes: [
        'We surface canonical vs derived fields with a visible provenance tag in each UI section.',
        'All charts/tables are read-only in v0; no writes are exposed publicly.',
        'Scores are recomputed in background; reads serve last-known values.',
      ],
    },
  }
}

