import React, { useMemo, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getRoundProjects } from '../../lib/apiClient'
import type { ProjectSummary } from '../../types/api'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { Trophy, ArrowUpRight, Github, ExternalLink, CircleCheck, Wrench, CircleDashed, Award, SearchX, ArrowLeft, ArrowUpDown, Search } from 'lucide-react'
import { Breadcrumb } from '../../components/atoms/Breadcrumb'

const columnHelper = createColumnHelper<ProjectSummary>()

export default function Round() {
  const { roundId } = useParams({ from: '/rounds/$roundId' })
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['roundProjects', roundId],
    queryFn: () => getRoundProjects(roundId),
  })

  const projects = data?.projects || []

  const columns = useMemo(() => [
    columnHelper.accessor('display_name', {
      header: 'Project',
      cell: (info) => (
        <div className="flex flex-col">
          <Link
            to="/projects/$canonicalId"
            params={{ canonicalId: info.row.original.canonical_id }}
            className="font-semibold text-surface-dark hover:text-primary-500 dark:text-white"
          >
            {info.getValue()}
          </Link>
          <span className="text-xs text-surface-dark/50 dark:text-white/40">{info.row.original.category || 'Uncategorized'}</span>
        </div>
      ),
    }),
    columnHelper.accessor('activity_status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue()
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            status === 'live'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : status === 'in-dev'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60'
          }`}>
            {status === 'live' ? <CircleCheck className="h-3 w-3" /> : status === 'in-dev' ? <Wrench className="h-3 w-3" /> : <CircleDashed className="h-3 w-3" />}
            {status}
          </span>
        )
      },
    }),
    columnHelper.accessor('criticality_score', {
      header: 'Criticality',
      cell: (info) => <span className="font-mono text-sm">{info.getValue()?.toFixed(2) || '0.00'}</span>,
      meta: { align: 'right' },
    }),
    columnHelper.accessor('pony_factor', {
      header: 'Pony Factor',
      cell: (info) => <span className="font-mono text-sm">{info.getValue() ?? '—'}</span>,
      meta: { align: 'right' },
    }),
    columnHelper.accessor('adoption_score', {
      header: 'Adoption',
      cell: (info) => <span className="font-mono text-sm">{info.getValue()?.toLocaleString() || '0'}</span>,
      meta: { align: 'right' },
    }),
    columnHelper.display({
      id: 'awarded',
      header: 'Awarded',
      cell: (info) => {
        const awarded = info.row.original.metadata?.scf_awarded
        if (awarded === 'yes' || awarded === true) {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <Award className="h-3 w-3" />
              Awarded
            </span>
          )
        }
        if (awarded === 'ineligible') {
          return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">Ineligible</span>
        }
        return <span className="text-surface-dark/20 dark:text-white/10">—</span>
      },
      meta: { align: 'center' },
    }),
    columnHelper.display({
      id: 'tranche',
      header: 'Tranche',
      cell: (info) => {
        const project = info.row.original
        const awarded = project.metadata?.scf_awarded
        if (awarded !== 'yes' && awarded !== true) return null
        const pct = Math.round((project.metadata?.scf_tranche_completion || 0) * 100)
        return (
          <div className="flex flex-col gap-1 w-[100px]">
            <span className="text-xs font-medium text-surface-dark/50 dark:text-white/40">{pct}%</span>
            <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-white/10">
              <div className="h-1 rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'links',
      header: () => <span className="block text-right">Links</span>,
      cell: (info) => {
        const project = info.row.original
        return (
          <div className="flex justify-end gap-3 text-surface-dark/40 dark:text-white/40">
            {project.git_org_url && (
              <a href={project.git_org_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-500" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.metadata?.website && (
              <a href={project.metadata.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-500" aria-label="Website">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <Link to="/projects/$canonicalId" params={{ canonicalId: project.canonical_id }} className="hover:text-primary-500" aria-label="Details">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )
      },
    }),
  ], [])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: projects,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Rounds', href: '/rounds' },
        { label: `Round ${roundId}` },
      ]} />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary-500" />
          <h2 className="text-2xl font-bold text-surface-dark dark:text-white">
            {data?.name || 'PG Award'} {roundId}
          </h2>
        </div>
        <p className="text-sm text-surface-dark/70 dark:text-white/70">
          Voting Closed: {data?.voting_closed || 'TBD'}
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm dark:bg-white/5 dark:border-white/10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            <span className="text-sm font-medium text-surface-dark/50 dark:text-white/50">Loading leaderboard...</span>
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
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 py-16 text-center dark:bg-white/[0.02] dark:border-white/15">
          <SearchX className="mx-auto h-10 w-10 text-surface-dark/15 dark:text-white/10" />
          <h3 className="mt-4 text-base font-semibold text-surface-dark dark:text-white">No projects found</h3>
          <p className="mt-1 text-sm text-surface-dark/50 dark:text-white/40">
            Round "{roundId}" doesn't have any matching projects yet.
          </p>
          <Link
            to="/rounds"
            className="mt-5 group inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Choose another round
          </Link>
        </div>
      ) : (
        <>
          {/* 4.7 + 4.21 — Search / filter bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-dark/30 dark:text-white/30" />
              <input
                type="text"
                placeholder="Search projects..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:bg-white/5 dark:border-white/15 dark:text-white"
              />
            </div>
            <span className="text-xs text-surface-dark/40 dark:text-white/30">
              {table.getFilteredRowModel().rows.length} of {projects.length} projects
            </span>
          </div>

          {/* Leaderboard table */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:bg-white/5 dark:border-white/15">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-surface-dark/50 dark:bg-white/5 dark:text-white/50">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => {
                        const align = (header.column.columnDef.meta as { align?: string })?.align
                        return (
                          <th
                            key={header.id}
                            className={`px-6 py-4 ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''} ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-surface-dark/70 dark:hover:text-white/70' : ''}`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                <ArrowUpDown className="h-3 w-3 opacity-40" />
                              )}
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5">
                      {row.getVisibleCells().map((cell) => {
                        const align = (cell.column.columnDef.meta as { align?: string })?.align
                        return (
                          <td key={cell.id} className={`px-6 py-4 ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''} dark:text-white/80`}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4.9 — Tansu boundary note */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-surface-dark/50 dark:bg-white/[0.02] dark:border-white/10 dark:text-white/30">
            Voting takes place on <strong>Tansu</strong> — PG Atlas does not embed Tansu or display voting outcomes. This leaderboard is for informational context only.
          </div>
        </>
      )}
    </div>
  )
}
