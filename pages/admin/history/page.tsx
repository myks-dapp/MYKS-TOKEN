"use client";

import { useState, useEffect } from "react";
import { useContract } from "@thirdweb-dev/react";
import { toast } from "sonner";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CONTRACT_ADDRESS = "0x233C286dc2Dd6baAA4597CffBcC908C03fA4EEFC";

export default function DistributionHistory() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const events = await contract.queryFilter("ProfitDistributed");
      const history = events.map((event) => ({
        amount: (parseInt(event.args[0]) / 1e6).toFixed(2),
        ipfsUrl: event.args[1],
        timestamp: new Date(event.args[2].toNumber() * 1000).toLocaleString(),
      }));

      setDistributions(history);
      setFiltered(history);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil histori distribusi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [contract]);

  useEffect(() => {
    let result = [...distributions];

    if (search) {
      result = result.filter((item) =>
        item.ipfsUrl.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minAmount) {
      result = result.filter((item) => parseFloat(item.amount) >= parseFloat(minAmount));
    }

    setFiltered(result);
  }, [search, minAmount, distributions]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("MYKS Profit Distribution Report", 14, 10);
    doc.autoTable({
      head: [["No", "Amount (USDC)", "Date", "Report URL"]],
      body: filtered.map((item, i) => [
        i + 1,
        item.amount,
        item.timestamp,
        item.ipfsUrl,
      ]),
    });
    doc.save("myks-profit-distribution.pdf");
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-yellow-600">Riwayat Distribusi Profit</h1>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <input
          type="text"
          placeholder="Cari IPFS URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3"
        />
        <input
          type="number"
          placeholder="Min Amount (USDC)"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3"
        />

        <CSVLink
          data={filtered}
          filename="myks-profit-distribution.csv"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Download CSV
        </CSVLink>

        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Download PDF
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Amount (USDC)</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Report</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">{item.amount}</td>
                    <td className="border p-2 text-center">{item.timestamp}</td>
                    <td className="border p-2 text-center">
                      <a
                        href={item.ipfsUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        View PDF
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border p-4 text-center text-gray-500">
                    Tidak ada data distribusi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}