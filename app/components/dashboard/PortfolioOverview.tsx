"use client"

import { TrendingUp } from "lucide-react"

export default function PortfolioOverview() {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-400 uppercase tracking-wide mb-2">Total Portfolio Value</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">₹1,24,532.50</h2>
          </div>
          <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded">
            <TrendingUp size={16} className="text-white" />
            <span className="text-sm font-semibold text-white">+12.5%</span>
            <span className="text-xs text-neutral-400">24h</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-l-2 border-white pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">INR Balance</p>
            <p className="text-lg md:text-xl font-bold">₹45,000</p>
            <p className="text-xs text-neutral-500 mt-1">+2.3% vs yesterday</p>
          </div>
          <div className="border-l-2 border-white pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">SOL Holdings</p>
            <p className="text-lg md:text-xl font-bold">12.45 SOL</p>
            <p className="text-xs text-neutral-500 mt-1">≈ ₹79,532.50</p>
          </div>
          <div className="border-l-2 border-neutral-700 pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">24H Volume</p>
            <p className="text-lg md:text-xl font-bold">₹8,450</p>
            <p className="text-xs text-neutral-500 mt-1">5 trades</p>
          </div>
          <div className="border-l-2 border-neutral-700 pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Unrealized P&L</p>
            <p className="text-lg md:text-xl font-bold text-white">+₹15,430</p>
            <p className="text-xs text-neutral-500 mt-1">+14.1%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
