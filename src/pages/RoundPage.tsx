import React from 'react'
import { Link, useRouterState, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getRoundProjects } from '../lib/apiClient'
import { Trophy, ArrowUpRight, Github, ExternalLink, ShieldCheck } from 'lucide-react'

export default function RoundPage() {
  const { roundId } = useParams({ from: '/rounds/$roundId' })

  const { data, isLoading, error } = useQuery({
    queryKey: ['roundProjects', roundId],
    queryFn: () => getRoundProjects(roundId),
  })

  const projects = data?.projects || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#914cff]" />
          <h2 className="text-2xl font-bold text-[#0f0f21] dark:text-white">
            {data?.name || 'PG Award'} {roundId}
          </h2>
        </div>
        <p className="text-sm text-[#0f0f21]/70 dark:text-white/70">
          Voting Closed: {data?.voting_closed || 'TBD'}
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm dark:bg-white/5 dark:border-white/10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            <span className="text-sm font-medium text-[#0f0f21]/50 dark:text-white/50">Loading leaderboard...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:bg-red-900/10 dark:border-red-900/20">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">Failed to load round data</h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300/80">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:bg-white/5 dark:border-white/15">
          <Trophy className="mx-auto h-12 w-12 text-[#0f0f21]/10 dark:text-white/10" />
          <h3 className="mt-4 text-lg font-semibold text-[#0f0f21] dark:text-white">No round projects found</h3>
          <p className="mt-2 text-sm text-[#0f0f21]/70 dark:text-white/70">
            We couldn't find any projects matching Round "{roundId}" in your local database dump.
          </p>
          <div className="mt-6">
            <Link
              to="/rounds"
              className="px-4 py-2 text-sm font-medium text-[#914cff] hover:underline"
            >
              ← Choose another round
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:bg-white/5 dark:border-white/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-[#0f0f21]/50 dark:bg-white/5 dark:text-white/50">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Criticality</th>
                  <th className="px-6 py-4 text-right">Adoption</th>
                  <th className="px-6 py-4 text-center">Awarded</th>
                  <th className="px-6 py-4" style={{ width: '120px' }}>Tranche</th>
                  <th className="px-6 py-4 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {projects.map((project: any) => (
                  <tr
                    key={project.canonical_id}
                    className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link
                          to="/projects/$projectId"
                          params={{ projectId: project.canonical_id }}
                          className="font-semibold text-[#0f0f21] hover:text-[#914cff] dark:text-white"
                        >
                          {project.display_name}
                        </Link>
                        <span className="text-xs text-[#0f0f21]/50 dark:text-white/40">{project.category || 'Uncategorized'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${project.activity_status === 'live'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : project.activity_status === 'in-dev'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60'
                        }`}>
                        {project.activity_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm dark:text-white/80">
                      {project.criticality_score?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm dark:text-white/80">
                      {project.adoption_score?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {project.metadata?.scf_awarded === 'yes' || project.metadata?.scf_awarded === true ? (
                        <ShieldCheck className="mx-auto h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : project.metadata?.scf_awarded === 'ineligible' ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700 dark:bg-red-900/20 dark:text-red-400">
                          Ineligible
                        </span>
                      ) : (
                        <span className="text-[#0f0f21]/20 dark:text-white/10">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {(project.metadata?.scf_awarded === 'yes' || project.metadata?.scf_awarded === true) && (
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-medium text-[#0f0f21]/50 dark:text-white/40">
                            <span>{Math.round((project.metadata?.scf_tranche_completion || 0) * 100)}%</span>
                          </div>
                          <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-white/10">
                            <div
                              className="h-1 rounded-full bg-[#914cff]"
                              style={{ width: `${(project.metadata?.scf_tranche_completion || 0) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3 text-[#0f0f21]/40 dark:text-white/40">
                        {project.git_org_url && (
                          <a href={project.git_org_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#914cff]" aria-label="View GitHub repository">
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {project.metadata?.website && (
                          <a href={project.metadata.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#914cff]" aria-label="Visit project website">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          to="/projects/$projectId"
                          params={{ projectId: project.canonical_id }}
                          className="hover:text-[#914cff]"
                          aria-label="View project details"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
