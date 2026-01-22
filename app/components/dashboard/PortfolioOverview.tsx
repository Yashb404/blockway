"use client"

import { TrendingUp } from "lucide-react"

type PortfolioOverviewProps = {
  inrBalance: number
  solBalance: number
}

const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value)

export default function PortfolioOverview({ inrBalance, solBalance }: PortfolioOverviewProps) {
  const totalValue = inrBalance
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-400 uppercase tracking-wide mb-2">Total Portfolio Value</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{formatInr(totalValue)}</h2>
          </div>
          <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded">
            <TrendingUp size={16} className="text-white" />
            <span className="text-sm font-semibold text-white">+12.5%</span>
            <span className="text-xs text-neutral-400">24h</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-l-2 border-white pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">INR Balance</p>
            <p className="text-lg md:text-xl font-bold">{formatInr(inrBalance)}</p>
            <p className="text-xs text-neutral-500 mt-1">No recent data</p>
          </div>
          <div className="border-l-2 border-white pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">SOL Holdings</p>
            <p className="text-lg md:text-xl font-bold">{solBalance.toFixed(2)} SOL</p>
            <p className="text-xs text-neutral-500 mt-1">≈ {formatInr(0)}</p>
          </div>
          <div className="border-l-2 border-neutral-700 pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">24H Volume</p>
            <p className="text-lg md:text-xl font-bold">{formatInr(0)}</p>
            <p className="text-xs text-neutral-500 mt-1">No trade data</p>
          </div>
          <div className="border-l-2 border-neutral-700 pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Unrealized P&L</p>
            <p className="text-lg md:text-xl font-bold text-white">{formatInr(0)}</p>
            <p className="text-xs text-neutral-500 mt-1">Not available</p>
          </div>
        </div>
      </div>
    </div>
  )
}
