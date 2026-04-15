import React from 'react'
import { roundListMeta } from "../../data/rounds";
import CurrentRoundCard from "../Home/components/CurrentRoundCard";

export default function Rounds() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h2 className="text-3xl font-bold tracking-tight text-surface-dark dark:text-white">PG Award Rounds</h2>
      <p className="mt-3 text-base leading-relaxed text-surface-dark/70 dark:text-white/70 max-w-2xl">
        Explore validated project leaderboards for each round over time.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {roundListMeta.map((meta) => (
          <CurrentRoundCard key={meta.id} roundMeta={meta} />
        ))}
      </div>
    </div>
  )
}
