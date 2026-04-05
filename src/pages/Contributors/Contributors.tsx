import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, ArrowRight, Users } from 'lucide-react'

export default function Contributors() {
  const navigate = useNavigate()
  const [contributorId, setContributorId] = useState('')

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold tracking-tight text-surface-dark dark:text-white">Contributors</h2>
      <p className="mt-3 text-base leading-relaxed text-surface-dark/70 dark:text-white/70 max-w-2xl">
        Explore contributor profiles and activity across the ecosystem.
      </p>

      <div className="mt-12 group relative overflow-hidden rounded-3xl border border-dashed border-gray-200 bg-white/40 p-10 text-center transition-all hover:bg-white/60 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-500/5 blur-3xl" />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 shadow-sm dark:bg-primary-500/10">
          <Users className="h-10 w-10" />
        </div>

        <h3 className="mt-6 text-xl font-bold text-surface-dark dark:text-white">Find a Contributor</h3>
        <p className="mt-2 text-sm text-surface-dark/60 dark:text-white/50 max-w-sm mx-auto">
          Enter a contributor identifier to view their profile, repos, and commit activity.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2.5 shadow-xl shadow-gray-200/20 transition-all focus-within:ring-4 focus-within:ring-primary-500/10 dark:bg-white/10 dark:border-white/15 dark:shadow-none">
            <Search className="ml-3 h-5 w-5 text-surface-dark/30 dark:text-white/30" aria-hidden="true" />
            <input
              id="contributorId"
              value={contributorId}
              onChange={(e) => setContributorId(e.target.value)}
              placeholder="e.g. c1"
              className="flex-1 bg-transparent px-2 py-2.5 text-lg font-medium text-surface-dark outline-none placeholder:text-surface-dark/20 dark:text-white dark:placeholder:text-white/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && contributorId) {
                  navigate({ to: '/contributors/$id', params: { id: contributorId } })
                }
              }}
            />
            <button
              type="button"
              onClick={() => navigate({ to: '/contributors/$id', params: { id: contributorId } })}
              disabled={!contributorId}
              className="group flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
            >
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
