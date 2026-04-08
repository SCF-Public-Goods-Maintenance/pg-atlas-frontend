import yaml from 'js-yaml'
import type { RoundData } from '../../types/rounds'

// Import YAML files as raw strings using Vite's ?raw suffix
import r2025Q3Raw from './2025Q3.yaml?raw'
import r2025Q4Raw from './2025Q4.yaml?raw'
import r2026Q1Raw from './2026Q1.yaml?raw'

const parseRound = (raw: string): RoundData => {
  return yaml.load(raw) as RoundData
}

const r2025Q3 = parseRound(r2025Q3Raw)
const r2025Q4 = parseRound(r2025Q4Raw)
const r2026Q1 = parseRound(r2026Q1Raw)

export const rounds: Record<string, RoundData> = {
  '2025Q3': r2025Q3,
  '2025Q4': r2025Q4,
  '2026Q1': r2026Q1,
}

export const roundList: RoundData[] = [
  r2026Q1,
  r2025Q4,
  r2025Q3,
]
