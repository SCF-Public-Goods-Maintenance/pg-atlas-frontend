import yaml from 'js-yaml'
import type { RoundData } from '../../types/rounds'

export type RoundMeta = Omit<RoundData, 'projects'> & { id: string; projectCount?: number }

export const roundListMeta: RoundMeta[] = [
  { id: '2026Q2', name: 'Public Goods Award', year: 2026, quarter: 2, voting_closed: '2026-04-10', projectCount: 5 },
  { id: '2026Q1', name: 'Public Goods Award', year: 2026, quarter: 1, voting_closed: '2026-01-10', projectCount: 11 },
  { id: '2025Q4', name: 'Public Goods Award', year: 2025, quarter: 4, voting_closed: '2025-10-10', projectCount: 10 },
  { id: '2025Q3', name: 'Public Goods Award', year: 2025, quarter: 3, voting_closed: '2025-07-14', projectCount: 9 },
]

const rawRounds = import.meta.glob('./*.yaml', { query: '?raw', import: 'default' })

const cache = new Map<string, RoundData>()

export async function getRound(roundId: string): Promise<RoundData | null> {
  const idLowerCase = roundId.toLowerCase()

  if (cache.has(idLowerCase)) {
    return cache.get(idLowerCase)!
  }

  const filename = `./${idLowerCase}.yaml`
  const loader = rawRounds[filename] as (() => Promise<string>) | undefined
  if (!loader) return null

  const raw = await loader()
  try {
    const parsed = yaml.load(raw) as RoundData
    cache.set(idLowerCase, parsed)
    return parsed
  } catch (e) {
    console.error(`Failed to parse YAML for round ${roundId}:`, e)
    return null
  }
}

export function prefetchRound(roundId: string) {
  // Trigger getRound silently to prepopulate the cache
  getRound(roundId).catch(() => { })
}
