import { roundList } from '../data/rounds'
import type { RoundProjectData } from '../types/rounds'

interface TrancheBucket {
  label: string
  min: number
  max: number
  color: string
}

const TRANCHE_BUCKETS: TrancheBucket[] = [
  { label: '0%', min: -Infinity, max: 0, color: '#ef4444' },
  { label: '1-33%', min: 0, max: 0.33, color: '#f97316' },
  { label: '34-66%', min: 0.33, max: 0.66, color: '#eab308' },
  { label: '67-99%', min: 0.66, max: 0.99, color: '#84cc16' },
  { label: '100%', min: 0.99, max: Infinity, color: '#10b981' },
]

/**
 * Collects all awarded projects across every round in src/data/rounds.
 * A project is considered awarded if `awarded === 'yes' || awarded === true`.
 */
function getAllAwardedProjects(): RoundProjectData[] {
  return roundList.flatMap((round) =>
    round.projects.filter((p) => p.awarded === 'yes' || p.awarded === true)
  )
}

/**
 * Computes the average tranche completion (0.0–1.0) across all awarded
 * projects from all rounds.
 *
 * Formula: sum(tranche_completion) / count(awarded projects)
 *
 * Example with 3 rounds of data:
 *   2025Q3: 9 awarded, all at 1.0 → sum = 9.0
 *   2025Q4: 10 awarded, all at 1.0 → sum = 10.0
 *   2026Q1: 12 awarded, all at 0.5, 1 not awarded → sum = 6.0
 *   Total: 31 awarded, sum = 25.0, avg = 25.0 / 31 = 0.806
 */
export function computeAverageTrancheCompletion(): number {
  const awarded = getAllAwardedProjects()
  if (awarded.length === 0) return 0
  const sum = awarded.reduce((acc, p) => acc + (p.tranche_completion || 0), 0)
  return sum / awarded.length
}

/**
 * Counts how many awarded projects from all rounds fall into each
 * tranche completion bucket.
 *
 * Buckets:
 *   0%     → tranche_completion === 0 (funding not started)
 *   1-33%  → 0 < completion <= 0.33 (early stage)
 *   34-66% → 0.33 < completion <= 0.66 (mid stage)
 *   67-99% → 0.66 < completion <= 0.99 (near complete)
 *   100%   → completion > 0.99 (fully disbursed)
 */
export function computeTrancheDistribution(): Array<{ label: string; value: number; color: string }> {
  const awarded = getAllAwardedProjects()
  return TRANCHE_BUCKETS.map((bucket) => ({
    label: bucket.label,
    value: awarded.filter((p) => {
      const v = p.tranche_completion || 0
      return v > bucket.min && v <= bucket.max
    }).length,
    color: bucket.color,
  }))
}

/**
 * Returns the total number of awarded projects across all rounds.
 */
export function computeTotalAwarded(): number {
  return getAllAwardedProjects().length
}
