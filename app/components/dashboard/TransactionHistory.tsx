"use client"

import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

type Transaction = {
  id: number | string
  type: string
  amount: string
  value: string
  time: string
  status?: string
}

type TransactionHistoryProps = {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold">Recent Transactions</h3>
        <button className="text-xs text-neutral-400 hover:text-white transition-colors uppercase font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-1">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-sm text-neutral-500 border border-dashed border-neutral-800 rounded">
            No transactions yet.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 hover:bg-neutral-900 rounded transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-full shrink-0 bg-neutral-800 text-white">
                  {tx.type === "buy" || tx.type === "deposit" ? (
                    <ArrowDownLeft size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold capitalize truncate">{tx.type}</p>
                  <p className="text-xs text-neutral-500">{tx.time}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-sm font-semibold">{tx.amount}</p>
                <p className="text-xs text-neutral-500">{tx.value}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-6 border border-neutral-700 text-white font-semibold py-3 rounded hover:bg-neutral-900 transition-colors">
        View Full History
      </button>
    </div>
  )
}
