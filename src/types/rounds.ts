import type { ProjectSummary } from '@pg-atlas/data-sdk'

export interface RoundProjectData {
  canonical_id: string | null
  name: string
  proposal_pr_url?: string
  tansu_proposal_url?: string
  project_page_url?: string
}

export interface RoundData {
  name: string
  year: number
  quarter: number
  voting_closed?: string
  projects: RoundProjectData[]
}

export type RoundEnrichedProject = ProjectSummary & {
  metadata?: {
    scf_submissions?: { round: string | number; title: string }[]
    scf_awarded?: boolean | 'yes' | 'no' | 'ineligible'
    scf_tranche_completion?: number
    website?: string
    description?: string
  }
}

export interface RoundDetail extends Omit<RoundData, 'projects'> {
  projects: RoundEnrichedProject[]
}

export interface RoundProjectsResponse {
  round_id: string
  projects: RoundEnrichedProject[]
}
