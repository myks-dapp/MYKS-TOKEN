import React from 'react'

type Props = {
  address: string | undefined
  phase: { name: string; price: number }
  balance: any
}

export default function TokenInfo({ address, phase, balance }: Props) {
  return (
    <>
      <p className="mb-2 text-gray-700">Wallet: {address || 'Not connected'}</p>
      <p className="mb-2 text-gray-600">Current Phase: <strong>{phase.name}</strong></p>
      <p className="mb-4 text-gray-600">Price per Token: <strong>{phase.price} MATIC</strong></p>
      <p className="mb-6 text-sm text-gray-500">Your MYKS Balance: <strong>{balance?.displayValue || 0}</strong></p>
    </>
  )
}
