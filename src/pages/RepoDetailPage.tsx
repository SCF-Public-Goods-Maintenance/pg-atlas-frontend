import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { getRepoDetail } from '../lib/apiClient'

export default function RepoDetailPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const parts = pathname.split('/').filter(Boolean)
  const repoCanonicalId = parts[0] === 'repos' ? parts[1] : undefined

  const repoQuery = useQuery({
    queryKey: ['repo', repoCanonicalId],
    queryFn: () => getRepoDetail(String(repoCanonicalId)),
    enabled: Boolean(repoCanonicalId),
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0f0f21] dark:text-white">
        {repoQuery.data?.repo.display_name ?? 'Repo'}
      </h2>
      <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
        Canonical id: {repoCanonicalId ?? '—'} • v0 repo detail
      </p>

      {repoQuery.isLoading && <div className="mt-6">Loading repo...</div>}
      {repoQuery.isError && <div className="mt-6">Unable to load repo.</div>}

      {repoQuery.data && (
        <div className="mt-6 space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">Repo metadata</h3>
            <div className="mt-3 text-sm text-[#0f0f21]/70 dark:text-white/70">
              Status: {repoQuery.data.repo.activity_status ?? '—'} • Latest commit:{' '}
              {repoQuery.data.repo.latest_commit_date
                ? new Date(repoQuery.data.repo.latest_commit_date).toLocaleDateString()
                : '—'}
            </div>

            {repoQuery.data.repo.repo_url && (
              <div className="mt-3">
                <a
                  href={repoQuery.data.repo.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline decoration-primary-500"
                >
                  Open on GitHub
                </a>
              </div>
            )}
          </section>

          {repoQuery.data.repo && repoQuery.data.parent_project && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
              <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">Parent project</h3>
              <div className="mt-3">
                <Link
                  to="/projects/$canonicalId"
                  params={{ canonicalId: repoQuery.data.parent_project.canonical_id }}
                  className="text-sm underline decoration-primary-500"
                >
                  {repoQuery.data.parent_project.display_name}
                </Link>
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">Neighborhood</h3>
            <div className="mt-3 text-sm text-[#0f0f21]/70 dark:text-white/70">
              Direct dependencies: {repoQuery.data.direct_dependencies?.length ?? 0} • Direct dependents:{' '}
              {repoQuery.data.direct_dependents?.length ?? 0}
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {repoQuery.data.direct_dependencies?.map((d) => (
                <div key={`dep-${d.repo_canonical_id}`}>
                  Depends on:{' '}
                  <Link to="/repos/$canonicalId" params={{ canonicalId: d.repo_canonical_id }}>
                    {d.repo_canonical_id}
                  </Link>
                </div>
              ))}
              {repoQuery.data.direct_dependents?.map((d) => (
                <div key={`depen-${d.repo_canonical_id}`}>
                  Depended by:{' '}
                  <Link to="/repos/$canonicalId" params={{ canonicalId: d.repo_canonical_id }}>
                    {d.repo_canonical_id}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

