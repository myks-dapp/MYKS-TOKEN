
import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { useState } from "react";

const CLAIM_CONTRACT_ADDRESS = "0xd8aE347c5155241164F0A727b308Abc417bf6321";

export default function ClaimProfitPage() {
  const address = useAddress();
  const { contract } = useContract(CLAIM_CONTRACT_ADDRESS);
  const { data: nextClaimTime, isLoading: loadingTime } = useContractRead(contract, "nextClaimTime", [address]);
  const { mutateAsync: claimProfit, isLoading: isClaiming } = useContractWrite(contract, "claimProfit");

  const [status, setStatus] = useState<string | null>(null);

  const handleClaim = async () => {
    try {
      setStatus("processing");
      await claimProfit();
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const now = Math.floor(Date.now() / 1000);
  const canClaim = nextClaimTime && now >= Number(nextClaimTime);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Klaim Profit Bulanan</h1>
        {loadingTime ? (
          <p className="text-center text-gray-500">Memuat data klaim...</p>
        ) : (
          <>
            <p className="text-center text-gray-700">
              {canClaim
                ? "Kamu bisa klaim profit sekarang."
                : "Belum bisa klaim. Harap tunggu 30 hari sejak klaim terakhir."}
            </p>
            <button
              onClick={handleClaim}
              disabled={!canClaim || isClaiming}
              className={`w-full py-2 rounded-xl text-white font-semibold ${
                canClaim ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isClaiming ? "Memproses..." : "Claim Profit"}
            </button>
            {status === "success" && <p className="text-green-600 text-center">Klaim berhasil!</p>}
            {status === "error" && <p className="text-red-600 text-center">Terjadi kesalahan saat klaim.</p>}
          </>
        )}
      </div>
    </div>
  );
}
