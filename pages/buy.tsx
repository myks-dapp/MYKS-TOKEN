'use client'

import { useAddress, useContract, useToken, useTokenBalance, useMetamask } from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'
import TokenInfo from '@/components/TokenInfo'
import BuyForm from '@/components/BuyForm'
import LoadingContracts from '@/components/LoadingContracts'

const SALE_CONTRACT = '0xdE36A031F39515E5A4D2700cbCc8837045667Dd7'
const TOKEN_CONTRACT = '0xbae14e5a05030f6Bcff900Be3C02A260C96e5D6c'

const phases = [
  { name: 'Presale Phase 1', start: new Date('2025-05-01T00:00:00Z').getTime(), end: new Date('2025-05-09T23:59:59Z').getTime(), price: 0.5 },
  { name: 'Presale Phase 2', start: new Date('2025-05-10T00:00:00Z').getTime(), end: new Date('2025-05-19T23:59:59Z').getTime(), price: 2 },
  { name: 'Presale Phase 3', start: new Date('2025-05-20T00:00:00Z').getTime(), end: new Date('2025-05-24T23:59:59Z').getTime(), price: 5 },
]

const getCurrentPhase = (now: number) => phases.find(phase => now >= phase.start && now <= phase.end) || null

export default function BuyPage() {
  const address = useAddress()
  const connect = useMetamask()
  const token = useToken(TOKEN_CONTRACT)
  const tokenContract = token?.contract
  const { data: balance } = useTokenBalance(tokenContract, address)
  const { contract: saleContract } = useContract(SALE_CONTRACT)

  const [phase, setPhase] = useState<any>(null)
  const [amount, setAmount] = useState<number>(1)

  useEffect(() => {
    const now = Date.now()
    const current = getCurrentPhase(now)
    setPhase(current)
  }, [])

  if (!tokenContract || !saleContract) return <LoadingContracts />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Buy MYKS Tokens</h1>

      {phase ? (
        <>
          <TokenInfo address={address} phase={phase} balance={balance} />
          <BuyForm
            address={address}
            connect={connect}
            saleContractAddress={SALE_CONTRACT}
            amount={amount}
            setAmount={setAmount}
            price={phase.price}
          />
        </>
      ) : (
        <p className="text-red-500 text-lg font-medium">
          Presale is not active at this time.
        </p>
      )}
    </div>
  )
}
