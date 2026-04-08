import React from 'react'
import { useProjectDetail, useProjectRepos, useProjectDependsOn } from '../../lib/api/queries/projects'
import { Link, useRouterState } from '@tanstack/react-router'
import { Breadcrumb } from '../../components/atoms/Breadcrumb'
import { GitBranch, ArrowUpRight, Network, ChevronRight, User, Github, HelpCircle, ExternalLink, Clock, FolderGit2, GitPullRequest, Vote, Globe } from 'lucide-react'
import { rounds } from '../../data/rounds'
import type { RepoSummary, ContributorSummary } from '@pg-atlas/data-sdk'
import type { RoundProjectData } from '../../types/rounds'

export default function ProjectDetail() {
  const pathname = useRouterState({ select: (s: { location: { pathname: string } }) => s.location.pathname })
  const parts = pathname.split('/').filter(Boolean)
  const canonicalId = parts[0] === 'projects' ? decodeURIComponent(parts[1]) : undefined

  const projectQuery = useProjectDetail(canonicalId || '')
  const reposQuery = useProjectRepos(canonicalId || '')
  const dependsOnQuery = useProjectDependsOn(canonicalId || '')

  const project = projectQuery.data
  const repos = reposQuery.data?.items ?? []
  const contributors: ContributorSummary[] = [] // Still empty as per previous implementation

  const roundMetadata = React.useMemo(() => {
    const id = project?.canonical_id || canonicalId;
    if (!id) return null;
    const matches = Object.values(rounds)
      .flatMap(round => round.projects)
      .filter(proj => proj.canonical_id === id);

    if (matches.length === 0) return null;

    // Pick the entry with the most URL fields defined
    return matches.sort((a, b) => {
      const count = (p: RoundProjectData) =>
        (p.proposal_pr_url ? 1 : 0) +
        (p.tansu_proposal_url ? 1 : 0) +
        (p.project_page_url ? 1 : 0);
      return count(b) - count(a);
    })[0];
  }, [project, canonicalId]);

  const dependencySubgraph = React.useMemo(() => {
    if (!project) return { nodes: [], edges: [] }
    const nodes: { id: string; canonical_id: string }[] = [
      { id: project.display_name, canonical_id: project.canonical_id }
    ]
    const edges: { from: string; to: string }[] = []

    if (dependsOnQuery.data) {
      dependsOnQuery.data.forEach(dep => {
        edges.push({ from: project.display_name, to: dep.project.display_name })
        nodes.push({ id: dep.project.display_name, canonical_id: dep.project.canonical_id })
      })
    }
    return { nodes, edges }
  }, [project, dependsOnQuery.data])

  const isLoading = projectQuery.isLoading || reposQuery.isLoading || dependsOnQuery.isLoading
  const isError = projectQuery.isError || reposQuery.isError || dependsOnQuery.isError

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/' },
        { label: project?.display_name ?? 'Project' },
      ]} />
      <h2 className="text-2xl font-bold text-surface-dark dark:text-white">{project?.display_name ?? 'Project'}</h2>
      <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono dark:bg-white/10">{canonicalId ?? '—'}</code>
      </p>

      {roundMetadata && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {roundMetadata.proposal_pr_url && (
            <a
              href={roundMetadata.proposal_pr_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm transition-all hover:bg-primary-100 hover:shadow dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20"
            >
              <GitPullRequest className="h-3.5 w-3.5" />
              Proposal PR
            </a>
          )}
          {roundMetadata.tansu_proposal_url && (
            <a
              href={roundMetadata.tansu_proposal_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm transition-all hover:bg-primary-100 hover:shadow dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20"
            >
              <Vote className="h-3.5 w-3.5" />
              Tansu Proposal
            </a>
          )}
          {roundMetadata.project_page_url && (
            <a
              href={roundMetadata.project_page_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm transition-all hover:bg-primary-100 hover:shadow dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20"
            >
              <Globe className="h-3.5 w-3.5" />
              Project Page
            </a>
          )}
        </div>
      )}

      {isLoading && <div className="mt-6">Loading project...</div>}
      {isError && <div className="mt-6">Unable to load project.</div>}

      {project && (
        <div className="mt-6 space-y-6">
          {/* 2.14 — Metric score cards with color coding and tooltips */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-surface-dark dark:text-white mb-4">Project metrics</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Criticality',
                  value: project.criticality_score,
                  color: 'border-l-red-400',
                  tooltip: 'Number of active projects depending on this',
                  provenance: 'PG Atlas',
                },
                {
                  label: 'Pony Factor',
                  value: project.pony_factor,
                  color: 'border-l-amber-400',
                  tooltip: 'Contributor concentration risk — lower means more distributed',
                  provenance: 'PG Atlas',
                },
                {
                  label: 'Adoption Score',
                  value: project.adoption_score?.toLocaleString(),
                  color: 'border-l-emerald-400',
                  tooltip: 'Derived from stars, downloads, and forks',
                  provenance: 'GitHub + deps.dev',
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className={`rounded-xl border border-gray-100 border-l-4 ${metric.color} bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/5`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-surface-dark/50 dark:text-white/40">{metric.label}</span>
                    <div className="group relative">
                      <HelpCircle className="h-3.5 w-3.5 text-surface-dark/30 dark:text-white/25 cursor-help" />
                      <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-surface-dark px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-surface-dark">
                        {metric.tooltip}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-surface-dark dark:text-white">{metric.value}</div>
                  <div className="mt-1 text-xs text-surface-dark/30 dark:text-white/25">{metric.provenance}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${project.activity_status === 'live'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60'
                }`}>
                {project.activity_status}
              </span>
              <span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-surface-dark/60 dark:border-white/15 dark:text-white/50">
                {String(project.metadata?.scf_category ?? 'Uncategorized')}
              </span>
              {project.git_owner_url && (
                <a
                  href={project.git_owner_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-surface-dark/70 hover:bg-gray-50 transition-colors dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
                >
                  <Github className="h-3 w-3" aria-hidden="true" />
                  GitHub
                </a>
              )}
            </div>

            {/* 4.10 — Additional metadata */}
            {(project.metadata?.description || project.metadata?.website || project.metadata?.x_profile || project.updated_at || roundMetadata) && (
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 dark:border-white/10">
                {project.metadata?.description && (
                  <p className="text-sm text-surface-dark/70 dark:text-white/60">{project.metadata.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {project.metadata?.website && (
                    <a
                      href={project.metadata.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-surface-dark/70 hover:bg-gray-50 transition-colors dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </a>
                  )}
                  {project.metadata?.x_profile && (
                    <a
                      href={`https://x.com/${project.metadata.x_profile}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-surface-dark/70 hover:bg-gray-50 transition-colors dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
                    >
                      @{project.metadata.x_profile}
                    </a>
                  )}

                  {/* Round-specific links */}
                  {roundMetadata?.proposal_pr_url && (
                    <a
                      href={roundMetadata.proposal_pr_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50/30 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50 transition-colors dark:border-primary-500/10 dark:bg-primary-500/5 dark:text-primary-400 dark:hover:bg-primary-500/10"
                    >
                      <GitPullRequest className="h-3 w-3" />
                      Proposal PR
                    </a>
                  )}
                  {roundMetadata?.tansu_proposal_url && (
                    <a
                      href={roundMetadata.tansu_proposal_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50/30 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50 transition-colors dark:border-primary-500/10 dark:bg-primary-500/5 dark:text-primary-400 dark:hover:bg-primary-500/10"
                    >
                      <Vote className="h-3 w-3" />
                      Tansu Proposal
                    </a>
                  )}
                  {roundMetadata?.project_page_url && (
                    <a
                      href={roundMetadata.project_page_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50/30 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50 transition-colors dark:border-primary-500/10 dark:bg-primary-500/5 dark:text-primary-400 dark:hover:bg-primary-500/10"
                    >
                      <Globe className="h-3 w-3" />
                      Project Page
                    </a>
                  )}

                  {project.updated_at && (
                    <span className="inline-flex items-center gap-1 text-xs text-surface-dark/40 dark:text-white/30">
                      <Clock className="h-3 w-3" />
                      Updated {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* 2.7 — Rich repo cards */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            {/* 4.14 — Repo count badge */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-dark dark:text-white">Associated repos</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-surface-dark/50 dark:bg-white/10 dark:text-white/40">
                <FolderGit2 className="h-3 w-3" />
                {repos.length}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {repos.map((r: RepoSummary) => (
                <Link
                  key={r.canonical_id}
                  to="/repos/$canonicalId"
                  params={{ canonicalId: r.canonical_id }}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:bg-white/5 dark:border-white/15 dark:hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-4 w-4 text-surface-dark/40 dark:text-white/40" aria-hidden="true" />
                    <div>
                      <div className="text-sm font-medium text-surface-dark dark:text-white">{r.display_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-surface-dark/30 dark:text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 2.6 — Styled dependency subgraph */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-dark dark:text-white">Dependency subgraph</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-surface-dark/60 dark:bg-white/10 dark:text-white/50">
                <Network className="h-3 w-3" aria-hidden="true" />
                {dependencySubgraph.nodes.length} nodes · {dependencySubgraph.edges.length} edges
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
              {dependencySubgraph.edges.map((e: { from: string, to: string }, idx: number) => (
                <div
                  key={`${e.from}->${e.to}-${idx}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-xs dark:border-white/10"
                >
                  <span className="font-medium text-surface-dark dark:text-white">{e.from}</span>
                  <span className="text-surface-dark/30 dark:text-white/30">→</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{e.to}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2.8 — Contributor cards with avatars */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-surface-dark dark:text-white">Contributors</h3>
            <div className="mt-3 space-y-2">
              {contributors.map((c: ContributorSummary) => (
                <Link
                  key={c.id}
                  to="/contributors/$id"
                  params={{ id: c.id }}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:bg-white/5 dark:border-white/15 dark:hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                      {c.name ? c.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium text-surface-dark dark:text-white">{c.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-surface-dark/30 dark:text-white/30 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

