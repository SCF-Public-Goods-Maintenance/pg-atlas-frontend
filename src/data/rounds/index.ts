import yaml from 'js-yaml'
import type { RoundData } from '../../types/rounds'

export type RoundMeta = Omit<RoundData, 'projects'> & { id: string; projectCount?: number }

const rawRoundsEager = import.meta.glob('./*.yaml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const roundListMeta: RoundMeta[] = Object.entries(rawRoundsEager).map(([path, raw]) => {
  const data = yaml.load(raw) as RoundData
  const id = path.split('/').pop()?.replace('.yaml', '').toUpperCase() || ''
  
  // Format voting_closed to string if it's a Date
  const voting_closed = data.voting_closed instanceof Date 
    ? data.voting_closed.toISOString().split('T')[0] 
    : data.voting_closed

  return {
    id,
    name: data.name,
    year: data.year,
    quarter: data.quarter,
    voting_closed,
    projectCount: data.projects?.length || 0
  }
}).sort((a, b) => (b.year * 10 + b.quarter) - (a.year * 10 + a.quarter))

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
