import type { RoundData } from '../../types/api'
import r2025Q3 from './2025Q3.json'
import r2025Q4 from './2025Q4.json'
import r2026Q1 from './2026Q1.json'

export const rounds: Record<string, RoundData> = {
  '2025Q3': r2025Q3 as unknown as RoundData,
  '2025Q4': r2025Q4 as unknown as RoundData,
  '2026Q1': r2026Q1 as unknown as RoundData,
}

export const roundList: RoundData[] = [
  r2026Q1 as unknown as RoundData,
  r2025Q4 as unknown as RoundData,
  r2025Q3 as unknown as RoundData,
]
