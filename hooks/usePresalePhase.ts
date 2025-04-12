export type PresalePhase = {
  name: string
  price: number
}

const PHASES: PresalePhase[] = [
  {
    name: 'Presale Phase 1',
    price: 0.5,
  },
  {
    name: 'Presale Phase 2',
    price: 2,
  },
  {
    name: 'Presale Phase 3',
    price: 5,
  },
]

const TIMESTAMPS = [
  {
    start: new Date('2025-05-01T00:00:00Z').getTime(),
    end: new Date('2025-05-09T23:59:59Z').getTime(),
  },
  {
    start: new Date('2025-05-10T00:00:00Z').getTime(),
    end: new Date('2025-05-19T23:59:59Z').getTime(),
  },
  {
    start: new Date('2025-05-20T00:00:00Z').getTime(),
    end: new Date('2025-05-24T23:59:59Z').getTime(),
  },
]

export function usePresalePhase(): PresalePhase | null {
  const now = Date.now()
  for (let i = 0; i < PHASES.length; i++) {
    const { start, end } = TIMESTAMPS[i]
    if (now >= start && now <= end) {
      return PHASES[i]
    }
  }
  return null
}