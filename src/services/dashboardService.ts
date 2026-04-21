import type { MetadataResponse, ProjectSummary } from '@pg-atlas/data-sdk'
import { computeAverageTrancheCompletion, computeTrancheDistribution, computeTotalAwarded } from '../lib/trancheHelpers'
import { getLiveDashboardData } from './apiAdapter'

export type DashboardHeadlineMetrics = MetadataResponse & {
  totalAwardedProjects?: number
  averageTrancheCompletion?: number
  trancheDistribution?: Array<{ label: string; value: number; color: string }>
}

export interface DashboardRoundSpotlight {
  roundId: string | number
  title: string
  proposalsCount: number
  category: string
}

export type TopCriticalProject = Pick<ProjectSummary, 'canonical_id' | 'display_name' | 'criticality_score' | 'adoption_score' | 'activity_status'>

export interface RiskBucket {
  label: string
  count: number
  color: string
}

export interface DashboardOverview {
  lastComputed: string
  metadataSummary: MetadataResponse
  headline: DashboardHeadlineMetrics
  currentRound: DashboardRoundSpotlight
  roundsIndex: Array<{ roundId: string | number; label: string; isCurrent: boolean }>
  topCriticalProjects: TopCriticalProject[]
  riskDistribution: RiskBucket[]
  dependencyCoveragePercent: number
  dataTransparency: {
    sources: Array<{ label: string; description: string; provenance: string }>
    processingNotes: string[]
  }
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  // 1. Start with the "ideal" structure (previously the mock)
  const baseData: DashboardOverview = {
    lastComputed: '2026-04-01T00:00:16.366169Z',
    metadataSummary: {
      total_projects: 641,
      total_repos: 2652,
      active_projects: 407,
      total_external_repos: 4746,
      total_dependency_edges: 9074,
      total_contributor_edges: 0,
      last_updated: '2026-04-01T00:00:16.366169Z',
    },
    headline: {
      total_projects: 641,
      active_projects: 407,
      total_repos: 2652,
      total_external_repos: 4746,
      total_dependency_edges: 9074,
      total_contributor_edges: 0,
      last_updated: '2026-04-01T00:00:16.366169Z',
      totalAwardedProjects: computeTotalAwarded(),
      averageTrancheCompletion: computeAverageTrancheCompletion(),
      trancheDistribution: computeTrancheDistribution(),
    },
    currentRound: {
      roundId: '2026Q1',
      title: 'Stellar Community Fund - Public Goods Award (Round 2026Q1)',
      proposalsCount: 41,
      category: 'Governance + Infrastructure',
    },
    roundsIndex: [
      { roundId: '2026Q1', label: 'Round 2026Q1 (Current)', isCurrent: true },
      { roundId: '2025Q4', label: 'Round 2025Q4', isCurrent: false },
      { roundId: '2025Q3', label: 'Round 2025Q3', isCurrent: false },
    ],
    topCriticalProjects: [
      { canonical_id: 'stellar-sdk', display_name: 'Stellar SDK', criticality_score: 95, adoption_score: 82.45, activity_status: 'live' },
      { canonical_id: 'soroban-cli', display_name: 'Soroban CLI', criticality_score: 91, adoption_score: 74.18, activity_status: 'live' },
      { canonical_id: 'freighter', display_name: 'Freighter Wallet', criticality_score: 88, adoption_score: 69.33, activity_status: 'live' },
      { canonical_id: 'stellar-core', display_name: 'Stellar Core', criticality_score: 85, adoption_score: 91.07, activity_status: 'live' },
      { canonical_id: 'horizon', display_name: 'Horizon API', criticality_score: 82, adoption_score: 77.62, activity_status: 'live' },
      { canonical_id: 'soroban-examples', display_name: 'Soroban Examples', criticality_score: 78, adoption_score: 45.89, activity_status: 'live' },
      { canonical_id: 'stellar-disbursement', display_name: 'Stellar Disbursement', criticality_score: 74, adoption_score: 38.14, activity_status: 'in-dev' },
      { canonical_id: 'kelp', display_name: 'Kelp Trading Bot', criticality_score: 71, adoption_score: 52.71, activity_status: 'live' },
      { canonical_id: 'stellar-anchor', display_name: 'Anchor Platform', criticality_score: 68, adoption_score: 61.05, activity_status: 'live' },
      { canonical_id: 'soroban-rpc', display_name: 'Soroban RPC', criticality_score: 65, adoption_score: 56.30, activity_status: 'in-dev' },
    ],
    riskDistribution: [
      { label: 'Low', count: 98, color: '#10b981' },
      { label: 'Medium', count: 45, color: '#eab308' },
      { label: 'High', count: 18, color: '#f97316' },
      { label: 'Critical', count: 7, color: '#ef4444' },
    ],
    dependencyCoveragePercent: 87,
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

  // 2. Fetch live data from the SDK (with fallback)
  let liveData: Partial<DashboardOverview> = {}
  try {
    liveData = await getLiveDashboardData()
  } catch (error) {
    console.error('Failed to fetch live dashboard data, using fallback:', error)
  }

  // 3. Merge live data over the base
  return {
    ...baseData,
    ...liveData,
    headline: {
      ...baseData.headline,
      ...(liveData.headline || {}),
    },
  }
}
