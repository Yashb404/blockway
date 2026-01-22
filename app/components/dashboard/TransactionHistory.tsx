"use client"

import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

export default function TransactionHistory() {
  const transactions = [
    { id: 1, type: "buy", amount: "2.5 SOL", value: "₹15,960", time: "2 hours ago", status: "completed" },
    { id: 2, type: "deposit", amount: "₹10,000", value: "+₹10,000", time: "5 hours ago", status: "completed" },
    { id: 3, type: "sell", amount: "1.2 SOL", value: "₹7,661", time: "1 day ago", status: "completed" },
    { id: 4, type: "withdraw", amount: "₹5,000", value: "-₹5,000", time: "2 days ago", status: "completed" },
    { id: 5, type: "buy", amount: "3.0 SOL", value: "₹19,152", time: "3 days ago", status: "pending" },
  ]

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold">Recent Transactions</h3>
        <button className="text-xs text-neutral-400 hover:text-white transition-colors uppercase font-semibold">View All</button>
      </div>
      <div className="space-y-1">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-neutral-900 rounded transition-colors group cursor-pointer">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-full flex-shrink-0 bg-neutral-800 text-white">
                {tx.type === "buy" || tx.type === "deposit" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold capitalize truncate">{tx.type}</p>
                <p className="text-xs text-neutral-500">{tx.time}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-sm font-semibold">{tx.amount}</p>
              <p className="text-xs text-neutral-500">{tx.value}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 border border-neutral-700 text-white font-semibold py-3 rounded hover:bg-neutral-900 transition-colors">View Full History</button>
    </div>
  )
}
