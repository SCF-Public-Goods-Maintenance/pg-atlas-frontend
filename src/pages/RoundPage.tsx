import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

export default function RoundPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const parts = pathname.split('/').filter(Boolean)
  const roundId = parts[0] === 'rounds' ? parts[1] : undefined

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0f0f21] dark:text-white">PG Award Round {roundId ?? '—'}</h2>
      <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
        v0 round pages are rendered from a build-time curated proposal ↔ project mapping.
        Next step: add the mapping file and wire it to the project leaderboard table (project metrics + filters).
      </p>

      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
          <div className="text-sm font-semibold text-[#0f0f21] dark:text-white">No round projects loaded yet</div>
          <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
            This page will populate once we commit the curated YAML/JSON mapping for the selected round.
          </p>
          <div className="mt-3 text-sm">
            <Link to="/rounds" className="underline decoration-primary-500 text-[#0f0f21] dark:text-white/80">
              Choose another round
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

