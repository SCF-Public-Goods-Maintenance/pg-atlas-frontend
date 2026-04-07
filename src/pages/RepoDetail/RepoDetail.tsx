import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useRepoDetail, useRepoDependsOn, useRepoHasDependents } from '../../lib/api/queries/repos'
import { Breadcrumb } from '../../components/atoms/Breadcrumb'
import { GitBranch, Clock, Github, ArrowDownLeft, ArrowUpRight, FolderOpen } from 'lucide-react'

export default function RepoDetail() {
  const pathname = useRouterState({ select: (s: { location: { pathname: string } }) => s.location.pathname })
  const parts = pathname.split('/').filter(Boolean)
  const repoCanonicalId = parts[0] === 'repos' ? parts[1] : undefined

  const repoQuery = useRepoDetail(repoCanonicalId || '')
  const dependsOnQuery = useRepoDependsOn(repoCanonicalId || '')
  const dependentsQuery = useRepoHasDependents(repoCanonicalId || '')

  const repo = repoQuery.data
  const isLoading = repoQuery.isLoading || dependsOnQuery.isLoading || dependentsQuery.isLoading
  const isError = repoQuery.isError || dependsOnQuery.isError || dependentsQuery.isError

  const directDependencies = dependsOnQuery.data?.map(d => ({ repo_canonical_id: d.canonical_id })) ?? []
  const directDependents = dependentsQuery.data?.map(d => ({ repo_canonical_id: d.canonical_id })) ?? []

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/' },
        { label: repo?.display_name ?? 'Repo' },
      ]} />
      <h2 className="text-2xl font-bold text-surface-dark dark:text-white">
        {repo?.display_name ?? 'Repo'}
      </h2>
      <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono dark:bg-white/10">{repoCanonicalId ?? '—'}</code>
      </p>

      {isLoading && <div className="mt-6">Loading repo...</div>}
      {isError && <div className="mt-6">Unable to load repo.</div>}

      {repo && (
        <div className="mt-6 space-y-6">
          {/* Icon-rich repo header card */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10">
                <GitBranch className="h-5 w-5 text-primary-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-dark dark:text-white">{repo.display_name}</h3>
                <div className="flex items-center gap-3 mt-0.5">
                  {repo.latest_commit_date && (
                    <span className="flex items-center gap-1 text-xs text-surface-dark/50 dark:text-white/40">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {new Date(repo.latest_commit_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {repo.repo_url && (
              <a
                href={repo.repo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-surface-dark hover:bg-gray-50 transition-colors dark:border-white/15 dark:text-white dark:hover:bg-white/10"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Open on GitHub
              </a>
            )}
          </section>

          {/* Parent project */}
          {repo.parent_project && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
              <h3 className="text-sm font-semibold text-surface-dark dark:text-white mb-3">Parent project</h3>
              <Link
                to="/projects/$canonicalId"
                params={{ canonicalId: repo.parent_project.canonical_id }}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-white/15 dark:hover:bg-white/10"
              >
                <FolderOpen className="h-4 w-4 text-surface-dark/40 dark:text-white/40" aria-hidden="true" />
                <span className="text-sm font-medium text-surface-dark dark:text-white">{repo.parent_project.display_name}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-surface-dark/30 dark:text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </section>
          )}

          {/* Split neighborhood: Dependencies + Dependents */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-surface-dark dark:text-white mb-4">Neighborhood</h3>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Dependencies */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowDownLeft className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-surface-dark/50 dark:text-white/40">
                    Dependencies
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    {directDependencies.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {directDependencies.map((d) => (
                    <Link
                      key={`dep-${d.repo_canonical_id}`}
                      to="/repos/$canonicalId"
                      params={{ canonicalId: d.repo_canonical_id }}
                      className="block rounded-lg border border-gray-100 px-3 py-2 text-xs font-medium text-surface-dark hover:bg-gray-50 transition-colors dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                    >
                      {d.repo_canonical_id}
                    </Link>
                  ))}
                  {directDependencies.length === 0 && (
                    <p className="text-xs text-surface-dark/40 dark:text-white/30">None</p>
                  )}
                </div>
              </div>

              {/* Dependents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-surface-dark/50 dark:text-white/40">
                    Dependents
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    {directDependents.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {directDependents.map((d) => (
                    <Link
                      key={`depen-${d.repo_canonical_id}`}
                      to="/repos/$canonicalId"
                      params={{ canonicalId: d.repo_canonical_id }}
                      className="block rounded-lg border border-gray-100 px-3 py-2 text-xs font-medium text-surface-dark hover:bg-gray-50 transition-colors dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                    >
                      {d.repo_canonical_id}
                    </Link>
                  ))}
                  {directDependents.length === 0 && (
                    <p className="text-xs text-surface-dark/40 dark:text-white/30">None</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
