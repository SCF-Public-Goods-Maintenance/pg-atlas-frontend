import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Activity,
  Clock,
  Database,
  FileText,
  GitBranch,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { getMockDashboardOverview } from '../mocks/dashboardOverviewMock'
import { getLiveDashboardData } from '../mocks/liveApiMock'
import { FinancialDistributionChart } from '../components/charts/FinancialDistributionChart'
import type { DashboardOverviewMock } from '../mocks/dashboardOverviewMock'

export default function HomePage() {
  const overviewQuery = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const mockData = await getMockDashboardOverview()
      const liveData = (await getLiveDashboardData()) as Partial<DashboardOverviewMock>

      return {
        ...mockData,
        ...liveData,
        metadataSummary: {
          ...mockData.metadataSummary,
          ...liveData.metadataSummary,
        },
        headline: {
          ...mockData.headline,
          ...liveData.headline,
        },
      }
    },
  })


  const overview = overviewQuery.data as DashboardOverviewMock | undefined

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0f0f21] dark:text-white">PG Atlas Dashboard</h2>
            <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
              Public ecosystem overview. This dashboard reads from mock data for now (step-by-step).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="pgx-rotate-target flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#0f0f21]/70 dark:bg-white/5 dark:border-white/15 dark:text-white/70">
              <Clock className="h-4 w-4 pgx-rotate-icon" aria-hidden="true" />
              Last refresh:{' '}
              {overview ? new Date(overview.lastComputed).toLocaleString() : '—'}
            </div>

            <Link
              to="/rounds/$roundId"
              params={{ roundId: String(overview?.currentRound.roundId ?? '2026Q1') }}
              className="pgx-btn relative group rounded-2xl bg-[#914cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#914cff]/90 focus:outline-none"
            >
              Open current round
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-[#0f0f21]/70 dark:text-white/70" aria-live="polite">
        {overviewQuery.isLoading && 'Loading ecosystem overview...'}
        {overviewQuery.isError && 'Unable to load dashboard overview.'}
      </div>

      {/* Headline metrics strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Headline metrics">
        <div className="pgx-rotate-target rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-white/5 dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#0f0f21]/70 dark:text-white/70">Total nodes</h3>
            <Database className="h-5 w-5 text-primary-600 dark:text-white/70 pgx-rotate-icon" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#0f0f21] dark:text-white">
            {overview?.metadataSummary.total_nodes ?? '—'}
          </p>
          <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">From Metadata summary</p>
        </div>

        <div className="pgx-rotate-target rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-white/5 dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#0f0f21]/70 dark:text-white/70">Total edges</h3>
            <Network className="h-5 w-5 text-primary-600 dark:text-white/70 pgx-rotate-icon" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#0f0f21] dark:text-white">
            {overview?.metadataSummary.total_edges ?? '—'}
          </p>
          <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">From Metadata summary</p>
        </div>

        <div className="pgx-rotate-target rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-white/5 dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#0f0f21]/70 dark:text-white/70">Active nodes</h3>
            <Activity className="h-5 w-5 text-primary-600 dark:text-white/70 pgx-rotate-icon" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#0f0f21] dark:text-white">
            {overview?.metadataSummary.active_count ?? '—'}
          </p>
          <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
            Recent activity coverage
          </p>
        </div>

        <div className="pgx-rotate-target rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-white/5 dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#0f0f21]/70 dark:text-white/70">Awarded projects</h3>
            <ShieldCheck className="h-5 w-5 text-primary-600 dark:text-white/70 pgx-rotate-icon" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#0f0f21] dark:text-white">
            {overview?.headline.totalAwardedProjects ?? '—'}
          </p>
          <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
            SCF Grant recipients
          </p>
        </div>

        <div className="pgx-rotate-target rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-white/5 dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#0f0f21]/70 dark:text-white/70">Tranche progress</h3>
            <Sparkles className="h-5 w-5 text-primary-600 dark:text-white/70 pgx-rotate-icon" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#0f0f21] dark:text-white">
            {overview?.headline.averageTrancheCompletion 
              ? `${(overview.headline.averageTrancheCompletion * 100).toFixed(1)}%` 
              : '—'}
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/10">
            <div 
              className="h-1.5 rounded-full bg-[#914cff]" 
              style={{ width: `${(overview?.headline.averageTrancheCompletion ?? 0) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current round spotlight + all rounds index */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">
                Current round spotlight
              </h3>
              <p className="mt-2 text-2xl font-bold text-[#0f0f21] dark:text-white">
                Round {overview?.currentRound.roundId ?? '—'}
              </p>
              <p className="mt-2 text-sm text-[#0f0f21]/70 dark:text-white/70">
                {overview?.currentRound.title ?? '—'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-white/10 dark:text-white/80">
                  {overview?.currentRound.proposalsCount ?? '—'} proposals
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-[#0f0f21]/70 dark:border-white/15 dark:text-white/70">
                  {overview?.currentRound.category ?? '—'}
                </span>
              </div>
            </div>

            <Link
              to="/rounds/$roundId"
              params={{ roundId: String(overview?.currentRound.roundId ?? '2026Q1') }}
              className="pgx-btn relative rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#0f0f21] hover:bg-gray-50 focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              View round
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
          <div className="pgx-rotate-target flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600 dark:text-white/70 pgx-rotate-icon" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">All rounds index</h3>
          </div>

          <div className="mt-3 space-y-2">
            {overview?.roundsIndex.map((r) => (
              <Link
                key={r.roundId}
                to="/rounds/$roundId"
                params={{ roundId: String(r.roundId) }}
                className={`pgx-btn relative group block rounded-xl border px-3 py-2 text-sm ${
                  r.isCurrent
                    ? 'border-[#914cff] bg-[#914cff]/10 text-[#914cff] dark:border-white/20 dark:bg-white/10 dark:text-white'
                    : 'border-gray-200 text-[#0f0f21] hover:bg-gray-50 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10'
                }`}
              >
                {r.label}
              </Link>
            ))}
            {!overview?.roundsIndex?.length && (
              <div className="text-sm text-[#0f0f21]/70 dark:text-white/70">—</div>
            )}
          </div>
        </div>
      </div>
      {/* Financial health charts */}
      <div className="mt-8">
        <FinancialDistributionChart 
          data={overview?.headline.trancheDistribution || []} 
          title="Tranche Completion across all Awarded Projects"
        />
      </div>

      {/* Data transparency panel */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="pgx-rotate-target flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600 dark:text-white/70 pgx-rotate-icon" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#0f0f21] dark:text-white">Data transparency</h3>
        </div>

        <p className="mt-2 text-sm text-[#0f0f21]/70 dark:text-white/70">
          Provenance tags + processing notes help users verify derived metrics.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary-600 dark:text-white/70 pgx-rotate-icon" aria-hidden="true" />
              <h4 className="text-xs font-semibold uppercase tracking-wide text-[#0f0f21]/70 dark:text-white/60">
                Sources
              </h4>
            </div>

            <div className="mt-3 space-y-2">
              {overview?.dataTransparency.sources.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-200 bg-white p-3 dark:border-white/15 dark:bg-white/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-[#0f0f21] dark:text-white">{s.label}</div>
                      <div className="mt-1 text-xs text-[#0f0f21]/70 dark:text-white/70">{s.description}</div>
                    </div>
                    <span className="rounded-full border border-gray-200 px-2 py-1 text-[10px] font-medium text-[#0f0f21]/70 dark:border-white/15 dark:text-white/70">
                      {s.provenance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[#0f0f21]/70 dark:text-white/60">
              Processing notes
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#0f0f21]/70 dark:text-white/70">
              {overview?.dataTransparency.processingNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
