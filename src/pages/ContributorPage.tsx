import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

export default function ContributorPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const parts = pathname.split('/').filter(Boolean)
  const contributorId = parts[0] === 'contributors' ? parts[1] : undefined

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-dark dark:text-white">
        Contributor {contributorId ?? '—'}
      </h2>
      <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
        Contributor profile and activity overview
      </p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="text-sm font-semibold text-surface-dark dark:text-white">No data available yet</div>
        <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
          Contributor details will appear here once available.
        </p>

        <div className="mt-3 text-sm">
          <Link to="/contributors" className="underline decoration-primary-500 text-surface-dark dark:text-white/80">
            Back to contributor selection
          </Link>
        </div>
      </div>
    </div>
  )
}

