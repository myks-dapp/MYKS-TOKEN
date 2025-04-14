import React from 'react'
import { Web3Button } from '@thirdweb-dev/react'

type Props = {
  address: string | undefined
  connect: () => void
  saleContractAddress: string
  amount: number
  setAmount: (value: number) => void
  price: number
}

export default function BuyForm({ address, connect, saleContractAddress, amount, setAmount, price }: Props) {
  const totalMatic = (amount * price).toFixed(2)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (val >= 1) setAmount(val)
  }

  return !address ? (
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
        onChange={handleChange}
        min={1}
        className="border px-4 py-2 rounded-lg w-full max-w-xs text-center mb-4"
      />
      <p className="text-green-600 mb-4">
        Total: <strong>{totalMatic}</strong> MATIC for <strong>{amount}</strong> MYKS
      </p>

      <Web3Button
        contractAddress={saleContractAddress}
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
  )
}
