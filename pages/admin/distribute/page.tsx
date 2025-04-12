"use client";

import {
  useAddress,
  useContract,
  useStorage,
} from "@thirdweb-dev/react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CONTRACT_ADDRESS = "0x233C286dc2Dd6baAA4597CffBcC908C03fA4EEFC";
const OWNER_ADDRESS = "0x8cDf6d7f383D69A4800eA035E35eD440a8054Ca8";

export default function DistributeProfitPage() {
  const address = useAddress();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const storage = useStorage();

  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwner = address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();
  const usdcToWei = (value: string) => BigInt(Math.floor(parseFloat(value) * 1e6));

  const handleUploadAndDistribute = async () => {
    if (!contract || !file || !amount || !storage) {
      toast.error("Lengkapi file & jumlah profit");
      return;
    }

    try {
      setLoading(true);
      toast("Uploading report to IPFS...");
      const ipfsHash = await storage.upload(file);
      const url = `https://ipfs.io/ipfs/${ipfsHash}`;
      setIpfsUrl(url);

      toast("Sending to blockchain...");
      await contract.call("distributeProfit", [usdcToWei(amount), url]);
      await contract.call("recordProfitReport", [url]);

      toast.success("Distribusi berhasil, mengirim email...");

      await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: [
            "investor1@email.com",
            "investor2@email.com",
            "investor3@email.com"
          ],
          amount,
          ipfsUrl: url,
        }),
      });

      toast.success("Email dikirim ke semua investor");
    } catch (err) {
      console.error(err);
      toast.error("Gagal distribusi atau kirim email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-yellow-600">Distribusi Profit MYKS</h1>

      {!address ? (
        <p className="text-red-500">Sambungkan wallet</p>
      ) : !isOwner ? (
        <p className="text-red-600 font-semibold">Hanya owner yang bisa akses</p>
      ) : (
        <>
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Input
            type="number"
            placeholder="Jumlah profit (USDC)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            onClick={handleUploadAndDistribute}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-yellow-500 text-white font-semibold"
          >
            {loading ? "Processing..." : "Upload & Distribute Profit"}
          </Button>

          {ipfsUrl && (
            <p className="text-sm text-green-600">
              Laporan: <a href={ipfsUrl} className="underline">{ipfsUrl}</a>
            </p>
          )}
        </>
      )}
    </div>
  );
}