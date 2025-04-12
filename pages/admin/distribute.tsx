'use client'

import { useAddress, useContract, Web3Button } from "@thirdweb-dev/react"
import { useState } from "react"
import { ThirdwebStorage } from "@thirdweb-dev/storage"
import { toast } from "sonner"

const DISTRIBUTOR_CONTRACT = "0x0D3838b3483Af0b6e9359ECA3494D1A067c5CD70"
const OWNER_ADDRESS = "0x8cDf6d7f383D69A4800eA035E35eD440a8054Ca8"
const storage = new ThirdwebStorage()

export default function DistributeProfitPage() {
  const address = useAddress()
  const { contract } = useContract(DISTRIBUTOR_CONTRACT)
  const [amount, setAmount] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [ipfsUrl, setIpfsUrl] = useState("")

  const isOwner = address?.toLowerCase() === OWNER_ADDRESS.toLowerCase()

  const usdcToWei = (amount: string) => {
    return BigInt(Math.floor(parseFloat(amount) * 1e6)) // USDC = 6 decimals
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file")
      return
    }

    toast("Uploading report to IPFS...")
    try {
      const cid = await storage.upload(file)
      const url = `https://ipfs.io/ipfs/${cid}`
      setIpfsUrl(url)
      toast.success("Report uploaded to IPFS")
    } catch (err) {
      console.error(err)
      toast.error("Failed to upload to IPFS")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Profit Distribution Panel</h1>
      <p className="text-center text-gray-600 mb-6 max-w-xl">
        Upload the monthly report and distribute USDC profit to all MYKS token holders proportionally.
      </p>

      {!address ? (
        <p className="text-red-500">Please connect your wallet.</p>
      ) : !isOwner ? (
        <p className="text-red-600 font-semibold text-lg">Access Denied: Only Owner</p>
      ) : (
        <>
          {/* Upload Laporan PDF */}
          <div className="mb-4 w-full max-w-sm">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            <button
              onClick={handleUpload}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Upload Report to IPFS
            </button>
          </div>

          {ipfsUrl && (
            <p className="text-sm text-green-600 mb-4 text-center">
              Report uploaded: <a href={ipfsUrl} target="_blank" className="underline">{ipfsUrl}</a>
            </p>
          )}

          {/* Input Profit Amount */}
          <input
            type="number"
            placeholder="Profit amount in USDC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full max-w-sm text-center mb-4"
          />

          {/* Distribute Button */}
          <Web3Button
            contractAddress={DISTRIBUTOR_CONTRACT}
            action={async (contract) => {
              if (!amount || parseFloat(amount) <= 0 || !ipfsUrl) {
                toast.error("Fill amount & upload report before distributing")
                return
              }

              await contract.call("distributeProfit", [usdcToWei(amount)])
              toast.success(`Successfully distributed ${amount} USDC to all holders`)
            }}
            className="bg-gradient-to-r from-red-600 to-green-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            Distribute Profit
          </Web3Button>
        </>
      )}
    </div>
  )
}