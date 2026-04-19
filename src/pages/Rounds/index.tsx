import React from 'react'
import { roundListMeta, type RoundMeta } from "../../data/rounds";
import CurrentRoundCard from "../Home/components/CurrentRoundCard";

export default function Rounds() {
  // The first round in the metadata is the latest "Current" round
  const currentRound = roundListMeta[0];

  // Group rounds by year for the historical view
  const roundsByYear = roundListMeta.reduce((acc, round) => {
    const year = round.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(round);
    return acc;
  }, {} as Record<number, RoundMeta[]>);

  // Sort years in descending order (2026, 2025...)
  const sortedYears = Object.keys(roundsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Within each year, sort rounds in ascending order by quarter (Q1, Q2...)
  sortedYears.forEach(year => {
    roundsByYear[year].sort((a, b) => a.quarter - b.quarter);
  });

  return (
    <div className="max-w-4xl mx-auto pb-12 px-4 sm:px-0">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-surface-dark dark:text-white">PG Award Rounds</h2>
        <p className="mt-3 text-base leading-relaxed text-surface-dark/70 dark:text-white/70 max-w-2xl">
          See which public goods have a proposal in the current and past SCF Public Goods Award rounds.
        </p>
      </div>

      {/* Featured: Current Round */}
      {currentRound && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary-500">
              Active Round
            </h3>
          </div>
          <div className="grid">
            <div className="transform hover:scale-[1.01] transition-transform duration-300">
              <CurrentRoundCard roundMeta={currentRound} />
            </div>
          </div>
        </div>
      )}

      {/* Yearly Timeline */}
      <div className="space-y-16">
        {sortedYears.map((year) => (
          <section key={year}>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-black text-surface-dark dark:text-white/90">
                {year}
              </h3>
              <div className="h-px flex-1 bg-surface-dark/10 dark:bg-white/10" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {roundsByYear[year].map((meta) => (
                <CurrentRoundCard key={meta.id} roundMeta={meta} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

