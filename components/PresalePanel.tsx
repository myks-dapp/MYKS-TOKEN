'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const phases = [
  {
    name: 'Presale Phase 1',
    start: new Date('2025-05-01T00:00:00Z').getTime(),
    end: new Date('2025-05-10T23:59:59Z').getTime(),
    price: '0.05 MATIC', // setara IDR 1,000
  },
  {
    name: 'Presale Phase 2',
    start: new Date('2025-05-11T00:00:00Z').getTime(),
    end: new Date('2025-05-20T23:59:59Z').getTime(),
    price: '0.25 MATIC', // setara IDR 5,000
  },
  {
    name: 'Presale Phase 3',
    start: new Date('2025-05-21T00:00:00Z').getTime(),
    end: new Date('2025-05-31T23:59:59Z').getTime(),
    price: '0.5 MATIC', // setara IDR 10,000
  },
]

const getCurrentPhase = (now: number) => {
  for (const phase of phases) {
    if (now < phase.start) return { status: 'upcoming' as const, phase }
    if (now >= phase.start && now <= phase.end) return { status: 'active' as const, phase }
  }
  return { status: 'ended' as const, phase: null }
}

const PresalePanel = () => {
  const [status, setStatus] = useState<'upcoming' | 'active' | 'ended'>('upcoming')
  const [currentPhase, setCurrentPhase] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const { status, phase } = getCurrentPhase(now)

      setStatus(status)
      setCurrentPhase(phase)

      const target = status === 'upcoming' ? phase?.start : phase?.end
      if (target) {
        const distance = target - now
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-10 text-center">
      {status === 'ended' ? (
        <div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Presale has ended.</h2>
          <p className="text-sm text-gray-500">Thank you for your support!</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {status === 'upcoming' ? 'Next Phase:' : 'Ongoing:'} {currentPhase?.name}
          </h2>

          <div className="flex justify-center gap-3 text-white text-base font-bold mb-3">
            <div className="bg-red-600 px-3 py-1 rounded-xl">{timeLeft.d}d</div>
            <div className="bg-yellow-400 text-black px-3 py-1 rounded-xl">{timeLeft.h}h</div>
            <div className="bg-green-600 px-3 py-1 rounded-xl">{timeLeft.m}m</div>
            <div className="bg-blue-600 px-3 py-1 rounded-xl">{timeLeft.s}s</div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Token Price: <strong>{currentPhase?.price}</strong> per MYKS
          </p>

          {status === 'active' ? (
            <Link
              href="/buy"
              className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white font-medium px-6 py-3 rounded-xl shadow hover:scale-105 transition"
            >
              Buy MYKS Tokens Now
            </Link>
          ) : (
            <button
              disabled
              className="inline-block bg-gray-300 text-gray-600 font-medium px-6 py-3 rounded-xl cursor-not-allowed"
            >
              Presale Not Active
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default PresalePanel
