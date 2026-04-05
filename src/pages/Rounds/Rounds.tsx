import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, ArrowRight } from 'lucide-react'

export default function Rounds() {
  const navigate = useNavigate()
  const [roundId, setRoundId] = useState('')

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold tracking-tight text-surface-dark dark:text-white">PG Award Rounds</h2>
      <p className="mt-3 text-base leading-relaxed text-surface-dark/70 dark:text-white/70 max-w-2xl">
        Round pages require the curated mapping file (proposal ↔ project) to render the leaderboard at build-time.
        Select or enter a round ID to explore.
      </p>

      <div className="mt-12 group pgx-rotate-target relative overflow-hidden rounded-3xl border border-dashed border-gray-200 bg-white/40 p-10 text-center transition-all hover:bg-white/60 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-500/5 blur-3xl" />

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500 pgx-rotate-icon shadow-sm">
              <Search className="h-10 w-10" />
          </div>

          <h3 className="mt-6 text-xl font-bold text-surface-dark dark:text-white">Dive into Round Data</h3>
          <p className="mt-2 text-sm text-surface-dark/60 dark:text-white/50 max-w-sm mx-auto">
              Enter a round identifier like <span className="font-mono text-primary-500">2025Q4</span> to view the validated project leaderboard.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2.5 shadow-xl shadow-gray-200/20 transition-all focus-within:ring-4 focus-within:ring-primary-500/10 dark:bg-white/10 dark:border-white/15 dark:shadow-none">
              <input
                id="roundId"
                value={roundId}
                onChange={(e) => setRoundId(e.target.value)}
                placeholder="2025Q4"
                className="flex-1 bg-transparent px-5 py-2.5 text-xl font-bold text-surface-dark outline-none placeholder:text-surface-dark/15 dark:text-white dark:placeholder:white/15"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && roundId) {
                    navigate({ to: '/rounds/$roundId', params: { roundId } })
                  }
                }}
              />
              <button
                type="button"
                onClick={() => navigate({ to: '/rounds/$roundId', params: { roundId } })}
                disabled={!roundId}
                className="pgx-btn group flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
              >
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-surface-dark/40 dark:text-white/40">Quick Access</span>
            <div className="flex flex-wrap justify-center gap-3">
              {['2025Q3', '2025Q4', '2026Q1'].map(id => (
                <button
                  key={id}
                  onClick={() => setRoundId(id)}
                  className={`px-5 py-2 rounded-full border transition-all text-xs font-bold leading-none ${
                    roundId === id
                      ? 'border-primary-500 bg-primary-50 text-primary-500'
                      : 'border-gray-200 text-surface-dark/60 hover:border-gray-300 hover:text-surface-dark dark:border-white/10 dark:text-white/50 dark:hover:border-white/30 dark:hover:text-white'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}

