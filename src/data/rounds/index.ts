import yaml from 'js-yaml'
import type { RoundData } from '../../types/rounds'

export type RoundMeta = Omit<RoundData, 'projects'> & { id: string; projectCount?: number }

export const roundListMeta: RoundMeta[] = [
  { id: '2026Q2', name: 'Public Goods Award', year: 2026, quarter: 2, voting_closed: '2026-04-10', projectCount: 5 },
  { id: '2026Q1', name: 'Public Goods Award', year: 2026, quarter: 1, voting_closed: '2026-01-10', projectCount: 11 },
  { id: '2025Q4', name: 'Public Goods Award', year: 2025, quarter: 4, voting_closed: '2025-10-10', projectCount: 10 },
  { id: '2025Q3', name: 'Public Goods Award', year: 2025, quarter: 3, voting_closed: '2025-07-14', projectCount: 9 },
]

// Import YAML files as raw string promises using Vite's dynamic glob
const rawRounds = import.meta.glob('./*.yaml', { query: '?raw', import: 'default' })

export async function getRound(roundId: string): Promise<RoundData | null> {
  const filename = `./${roundId.toLowerCase()}.yaml`;
  const loader = rawRounds[filename] as (() => Promise<string>) | undefined;
  if (!loader) return null;
  const raw = await loader();
  return yaml.load(raw) as RoundData;
}
