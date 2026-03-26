export interface MetadataSummary {
  total_nodes: number
  total_edges: number
  active_count: number
  last_full_recompute: string
}

export interface MetadataResponse {
  status: 'ok'
  last_computed: string
  summary: MetadataSummary
}

export type ProjectActivityStatus = 'live' | 'maintenance' | 'deprecated'

export interface ScfSubmission {
  round: number
  title: string
}

export interface ProjectMetadata {
  scf_submissions?: ScfSubmission[]
  scf_category?: string
  scf_tranche_completion?: number
  scf_awarded?: boolean
  awarded?: boolean
  description?: string
  website?: string
  x_profile?: string
}

export interface ProjectSummary {
  canonical_id: string
  display_name: string
  project_type?: string
  activity_status: ProjectActivityStatus
  criticality_score: number
  pony_factor: number
  adoption_score: number
  git_org_url: string
  metadata?: ProjectMetadata
}

export interface ProjectDetailResponse {
  project: ProjectSummary
  repos: RepoSummary[]
  dependency_subgraph: {
    nodes: { id: string; repo_canonical_id: string }[]
    edges: { from: string; to: string }[]
  }
  contributors: ContributorSummary[]
}

export interface RepoSummary {
  canonical_id: string
  display_name: string
  project_id: string
  activity_status?: ProjectActivityStatus
  latest_version?: string
  latest_commit_date?: string
  repo_url?: string
  adoption_downloads?: number
  adoption_stars?: number
  adoption_forks?: number
  criticality_score?: number
  pony_factor?: number
}

export interface ContributorSummary {
  id: string
  name: string
  email_hash?: string
}

export interface RoundProjectsResponse {
  round_id: string
  projects: ProjectSummary[]
}

export interface ContributorDetailResponse {
  contributor: ContributorSummary
  activity: {
    repo_canonical_id: string
    number_of_commits: number
    first_commit_date: string
    last_commit_date: string
    project_canonical_id: string
  }[]
}

export interface RepoDetailResponse {
  repo: RepoSummary
  parent_project?: ProjectSummary
  direct_dependencies?: { repo_canonical_id: string }[]
  direct_dependents?: { repo_canonical_id: string }[]
}
