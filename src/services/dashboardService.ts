import type { MetadataResponse } from '@pg-atlas/data-sdk'
import { computeAverageTrancheCompletion, computeTrancheDistribution, computeTotalAwarded } from '../lib/trancheHelpers'
import { getLiveDashboardData } from './apiAdapter'

export interface DashboardHeadlineMetrics {
  totalProjects: number
  activeProjects: number
  totalRepos: number
  totalExternalRepos: number
  totalDependencyEdges: number
  totalContributorEdges: number
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

export interface TopCriticalProject {
  canonical_id: string
  display_name: string
  criticality_score: number
  pony_factor: number
  activity_status: string
}

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
      totalProjects: 641,
      activeProjects: 407,
      totalRepos: 2652,
      totalExternalRepos: 4746,
      totalDependencyEdges: 9074,
      totalContributorEdges: 0,
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
      { canonical_id: 'stellar-sdk', display_name: 'Stellar SDK', criticality_score: 0.95, pony_factor: 2, activity_status: 'live' },
      { canonical_id: 'soroban-cli', display_name: 'Soroban CLI', criticality_score: 0.91, pony_factor: 3, activity_status: 'live' },
      { canonical_id: 'freighter', display_name: 'Freighter Wallet', criticality_score: 0.88, pony_factor: 4, activity_status: 'live' },
      { canonical_id: 'stellar-core', display_name: 'Stellar Core', criticality_score: 0.85, pony_factor: 2, activity_status: 'live' },
      { canonical_id: 'horizon', display_name: 'Horizon API', criticality_score: 0.82, pony_factor: 3, activity_status: 'live' },
      { canonical_id: 'soroban-examples', display_name: 'Soroban Examples', criticality_score: 0.78, pony_factor: 5, activity_status: 'live' },
      { canonical_id: 'stellar-disbursement', display_name: 'Stellar Disbursement', criticality_score: 0.74, pony_factor: 3, activity_status: 'in-dev' },
      { canonical_id: 'kelp', display_name: 'Kelp Trading Bot', criticality_score: 0.71, pony_factor: 1, activity_status: 'live' },
      { canonical_id: 'stellar-anchor', display_name: 'Anchor Platform', criticality_score: 0.68, pony_factor: 4, activity_status: 'live' },
      { canonical_id: 'soroban-rpc', display_name: 'Soroban RPC', criticality_score: 0.65, pony_factor: 2, activity_status: 'in-dev' },
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

  // 2. Fetch live data from the SDK
  const liveData = await getLiveDashboardData()

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
