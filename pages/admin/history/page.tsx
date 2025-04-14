"use client";

import { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { toast } from "react-toastify";

const Page = () => {
  const [distributions, setDistributions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Inisialisasi kontrak
  const { contract } = useContract("0x233C286dc2Dd6baAA4597CffBcC9080Cb96452a1");

  const fetchHistory = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      // Menangani query event secara langsung tanpa filter (menggunakan queryFilter)
      const events = await contract.queryFilter({
        address: contract.address, // Alamat kontrak
        topics: [contract.interface.getEventTopic("ProfitDistributed")], // Topik untuk event yang diinginkan
      });

      const history = events.map((event) => {
        const { to, amount } = event.args as any;
        return {
          to,
          amount: parseFloat(amount.toString()) / 1e6, // Mengonversi amount ke format yang benar
          timestamp: event.blockNumber, // Timestamp atau block number
        };
      });

      setDistributions(history);
    } catch (err) {
      console.error("Error fetching distribution history:", err);
      toast.error("Failed to fetch distribution history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [contract]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Profit Distribution History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {distributions.map((dist, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded shadow">
              <p><strong>To:</strong> {dist.to}</p>
              <p><strong>Amount (USDC):</strong> {dist.amount}</p>
              <p><strong>Block Number:</strong> {dist.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
