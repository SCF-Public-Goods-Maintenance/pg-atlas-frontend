import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

export default function ContributorPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const parts = pathname.split('/').filter(Boolean)
  const contributorId = parts[0] === 'contributors' ? parts[1] : undefined

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0f0f21] dark:text-white">
        Contributor {contributorId ?? '—'}
      </h2>
      <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
        Contributor detail is wired once the v0 contributor endpoints are defined in the API layer.
      </p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
        <div className="text-sm font-semibold text-[#0f0f21] dark:text-white">No contributor data loaded yet</div>
        <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
          When the backend exposes the contributor endpoints, this route will load:
          identity linkage, contributed repos/projects, commit stats, and derived fields.
        </p>

        <div className="mt-3 text-sm">
          <Link to="/contributors" className="underline decoration-primary-500 text-[#0f0f21] dark:text-white/80">
            Back to contributor selection
          </Link>
        </div>
      </div>
    </div>
  )
}

