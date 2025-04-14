"use client";

import { useState, useEffect, useMemo } from "react";
import { useContract } from "@thirdweb-dev/react";
import { toast } from "sonner";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CONTRACT_ADDRESS = "0x233C286dc2Dd6baAA4597CffBcC9080Cb96452a1";

type Distribution = {
  amount: string;
  ipfsUrl: string;
  timestamp: string;
};

export default function DistributionHistory() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [search, setSearch] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!contract) return;

    try {
      setLoading(true);

      const filter = contract.getContractWrapper().contract.filters.ProfitDistributed();
      const events = await contract.getContractWrapper().contract.queryFilter(filter);

      const history: Distribution[] = events.map((event) => ({
        amount: (parseInt(event.args[0]) / 1e6).toFixed(2),
        ipfsUrl: event.args[1],
        timestamp: new Date(event.args[2].toNumber() * 1000).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

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

  const filtered = useMemo(() => {
    return distributions.filter((item) => {
      const matchesSearch = search ? item.ipfsUrl.toLowerCase().includes(search.toLowerCase()) : true;
      const meetsMinAmount = minAmount ? parseFloat(item.amount) >= parseFloat(minAmount) : true;
      return matchesSearch && meetsMinAmount;
    });
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

  const csvData = filtered.map((item, i) => ({
    No: i + 1,
    Amount_USDC: item.amount,
    Date: item.timestamp,
    Report_URL: item.ipfsUrl,
  }));

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-yellow-600">Profit Distribution History</h1>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <input
          type="text"
          placeholder="Search IPFS URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3"
        />
        <input
          type="number"
          placeholder="Minimum Amount (USDC)"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3"
        />

        <CSVLink
          data={csvData}
          filename="myks-profit-distribution.csv"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Export CSV
        </CSVLink>

        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Export PDF
        </button>
      </div>

      {loading ? (
        <p className="text-center mt-4 text-gray-600">Loading data...</p>
      ) : filtered.length > 0 ? (
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
              {filtered.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{item.amount}</td>
                  <td className="border p-2 text-center">{item.timestamp}</td>
                  <td className="border p-2 text-center">
                    <a
                      href={item.ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No distribution data found.</p>
      )}
    </div>
  );
}
