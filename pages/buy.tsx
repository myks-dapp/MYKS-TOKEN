'use client'

import {
  useAddress,
  useContract,
  useToken,
  useTokenBalance,
  Web3Button,
  useMetamask,
} from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'

const SALE_CONTRACT = '0xdE36A031F39515E5A4D2700cbCc8837045667Dd7' // MYKSSale final
const TOKEN_CONTRACT = '0xbae14e5a05030f6Bcff900Be3C02A260C96e5D6c' // MYKS Token

const phases = [
  { name: 'Presale Phase 1', start: new Date('2025-05-01T00:00:00Z').getTime(), end: new Date('2025-05-09T23:59:59Z').getTime(), price: 0.5 },
  { name: 'Presale Phase 2', start: new Date('2025-05-10T00:00:00Z').getTime(), end: new Date('2025-05-19T23:59:59Z').getTime(), price: 2 },
  { name: 'Presale Phase 3', start: new Date('2025-05-20T00:00:00Z').getTime(), end: new Date('2025-05-24T23:59:59Z').getTime(), price: 5 },
]

const getCurrentPhase = (now: number) => {
  for (const phase of phases) {
    if (now >= phase.start && now <= phase.end) return phase
  }
  return null
}

export default function BuyPage() {
  const address = useAddress()
  const connect = useMetamask()
  const { contract: token } = useToken(TOKEN_CONTRACT)
  const { data: balance } = useTokenBalance(token, address)
  const { contract: saleContract } = useContract(SALE_CONTRACT)

  const [phase, setPhase] = useState<any>(null)
  const [amount, setAmount] = useState<number>(1)

  useEffect(() => {
    const now = Date.now()
    const current = getCurrentPhase(now)
    setPhase(current)
  }, [])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value >= 1) setAmount(value)
  }

  const totalMatic = phase && amount ? (amount * phase.price).toFixed(2) : '0'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Buy MYKS Tokens</h1>

      {phase ? (
        <>
          <p className="mb-2 text-gray-700">Wallet: {address || 'Not connected'}</p>
          <p className="mb-2 text-gray-600">Current Phase: <strong>{phase.name}</strong></p>
          <p className="mb-4 text-gray-600">Price per Token: <strong>{phase.price} MATIC</strong></p>
          <p className="mb-6 text-sm text-gray-500">Your MYKS Balance: <strong>{balance?.displayValue || 0}</strong></p>

          {!address ? (
            <button
              onClick={connect}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition mb-4"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min={1}
                className="border px-4 py-2 rounded-lg w-full max-w-xs text-center mb-4"
              />
              <p className="text-green-600 mb-4">
                Total: <strong>{totalMatic}</strong> MATIC for <strong>{amount}</strong> MYKS
              </p>

              <Web3Button
                contractAddress={SALE_CONTRACT}
                action={async (contract) => {
                  await contract.call('buyTokens', [], {
                    value: BigInt(Math.floor(parseFloat(totalMatic) * 1e18)),
                  })
                }}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
              >
                Buy {amount} MYKS
              </Web3Button>
            </>
          )}
        </>
      ) : (
        <p className="text-red-500 text-lg font-medium">
          Presale is not active at this time.
        </p>
      )}
    </div>
  )
}
