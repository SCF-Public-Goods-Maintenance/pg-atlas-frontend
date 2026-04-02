import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'

export default function RoundsIndexPage() {
  const navigate = useNavigate()
  const [roundId, setRoundId] = useState('2025Q4')

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0f0f21] dark:text-white">PG Award Rounds</h2>
      <p className="mt-1 text-sm text-[#0f0f21]/70 dark:text-white/70">
        Round pages require the curated mapping file (proposal ↔ project) to render the leaderboard at build-time.
        This route is the entry point for selecting a round.
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-white/5 dark:border-white/15">
        <label className="text-sm font-medium text-[#0f0f21] dark:text-white" htmlFor="roundId">
          Round id
        </label>
        <div className="flex items-center gap-3">
          <input
            id="roundId"
            value={roundId}
            onChange={(e) => setRoundId(e.target.value)}
            className="w-32 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[#0f0f21] outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-white/5 dark:border-white/15"
          />
          <button
            type="button"
            onClick={() => navigate({ to: '/rounds/$roundId', params: { roundId } })}
            className="pgx-btn rounded-xl bg-[#914cff] px-4 py-2 text-sm font-medium text-white hover:bg-[#914cff]/90 focus:outline-none"
          >
            Open round
          </button>
        </div>

        <div className="text-xs text-[#0f0f21]/70 dark:text-white/70">
          Example link (if you already know the id):
          <div className="mt-2">
            <Link to="/rounds/$roundId" params={{ roundId: '2025Q4' }} className="underline decoration-primary-500">
              /rounds/2025Q4
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

