import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'

export default function ContributorsIndexPage() {
  const navigate = useNavigate()
  const [contributorId, setContributorId] = useState('c1')

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0f0f21] dark:text-white">Contributors</h2>
      <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
        Contributor detail is wired once the v0 contributor API endpoints are defined in the backend.
        This route is the entry point for selecting a contributor id.
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
        <label className="text-sm font-medium text-[#0f0f21] dark:text-white" htmlFor="contributorId">
          Contributor id
        </label>
        <div className="flex items-center gap-3">
          <input
            id="contributorId"
            value={contributorId}
            onChange={(e) => setContributorId(e.target.value)}
            className="w-40 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[#0f0f21] outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-white/5 dark:border-white/15"
          />
          <button
            type="button"
            onClick={() => navigate({ to: '/contributors/$id', params: { id: contributorId } })}
            className="pgx-btn rounded-xl bg-[#914cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#914cff]/90 focus:outline-none"
          >
            Open contributor
          </button>
        </div>

        <div className="text-xs text-[#0f0f21]/70 dark:text-white/70">
          Example link:
          <div className="mt-2">
            <Link to="/contributors/$id" params={{ id: 'c1' }} className="underline decoration-primary-500">
              /contributors/c1
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

