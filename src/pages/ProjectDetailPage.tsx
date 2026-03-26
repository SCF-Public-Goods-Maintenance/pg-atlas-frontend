import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { getProjectDetail } from '../lib/apiClient'

export default function ProjectDetailPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const parts = pathname.split('/').filter(Boolean)
  const canonicalId = parts[0] === 'projects' ? parts[1] : undefined

  const projectQuery = useQuery({
    queryKey: ['project', canonicalId],
    queryFn: () => getProjectDetail(String(canonicalId)),
    enabled: Boolean(canonicalId),
  })

  const project = projectQuery.data?.project

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0f0f21] dark:text-white">{project?.display_name ?? 'Project'}</h2>
      <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
        Canonical id: {canonicalId ?? '—'} • v0 project detail
      </p>

      {projectQuery.isLoading && <div className="mt-6">Loading project...</div>}
      {projectQuery.isError && <div className="mt-6">Unable to load project.</div>}

      {projectQuery.data && (
        <div className="mt-6 space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">Project metrics</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-xs text-[#0f0f21]/70 dark:text-white/70">Criticality</div>
                <div className="text-lg font-semibold text-[#0f0f21] dark:text-white">
                  {project.criticality_score}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#0f0f21]/70 dark:text-white/70">Pony factor</div>
                <div className="text-lg font-semibold text-[#0f0f21] dark:text-white">{project.pony_factor}</div>
              </div>
              <div>
                <div className="text-xs text-[#0f0f21]/70 dark:text-white/70">Adoption score</div>
                <div className="text-lg font-semibold text-[#0f0f21] dark:text-white">{project.adoption_score}</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-[#0f0f21]/70 dark:text-white/70">
              Category: {project.metadata?.scf_category ?? 'Uncategorized'} • Status: {project.activity_status}
            </div>
            <div className="mt-3">
              <a
                href={project.git_org_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline decoration-primary-500"
              >
                GitHub
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">Associated repos</h3>
            <div className="mt-3 space-y-2">
              {projectQuery.data.repos.map((r) => (
                <Link
                  key={r.canonical_id}
                  to="/repos/$canonicalId"
                  params={{ canonicalId: r.canonical_id }}
                  className="block rounded-xl border border-gray-200 bg-white px-4 py-3 hover:-translate-y-0.5 transition-transform dark:bg-white/5 dark:border-white/15"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-medium text-[#0f0f21] dark:text-white">{r.display_name}</div>
                    <div className="text-xs text-[#0f0f21]/70 dark:text-white/70">{r.activity_status ?? '—'}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">Dependency subgraph</h3>
            <div className="mt-3 text-sm text-[#0f0f21]/70 dark:text-white/70">
              Nodes: {projectQuery.data.dependency_subgraph.nodes.length} • Edges:{' '}
              {projectQuery.data.dependency_subgraph.edges.length}
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {projectQuery.data.dependency_subgraph.edges.map((e, idx) => (
                <div key={`${e.from}->${e.to}-${idx}`}>{e.from} → {e.to}</div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
            <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">Contributors</h3>
            <div className="mt-3 space-y-2">
              {projectQuery.data.contributors.map((c) => (
                <Link
                  key={c.id}
                  to="/contributors/$id"
                  params={{ id: c.id }}
                  className="block rounded-xl border border-gray-200 bg-white px-4 py-3 hover:-translate-y-0.5 transition-transform dark:bg-white/5 dark:border-white/15"
                >
                  <div className="text-sm font-medium text-[#0f0f21] dark:text-white">{c.name}</div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

