"use client"

import { TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

type PortfolioOverviewProps = {
  inrBalance: number
  solBalance: number
}

const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value)

export default function PortfolioOverview({ inrBalance, solBalance }: PortfolioOverviewProps) {
  const [solPriceInr, setSolPriceInr] = useState(0);

  useEffect(() => {
     (async () => {
         try {
             // Fetch USD price
             const res = await fetch('/api/jupiter?type=price');
             const data = await res.json();
             // Dynamic INR/USD
             const rate = data.rate || 86.5;
             if(data.price) setSolPriceInr(data.price * rate);
         } catch(e) {}
     })();
  }, []);

  const solValueInr = solBalance * solPriceInr;
  const totalValue = inrBalance + solValueInr;
  const prevValue = 10000; // Mock for percentage

  const pnlPercent = prevValue > 0 ? ((totalValue - prevValue) / prevValue) * 100 : 0;

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
            <span className="text-sm font-semibold text-white">{pnlPercent.toFixed(2)}%</span>
            <span className="text-xs text-neutral-400">24h</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-l-2 border-white pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">INR Balance</p>
            <p className="text-lg md:text-xl font-bold">{formatInr(inrBalance)}</p>
            <p className="text-xs text-neutral-500 mt-1">Fiat</p>
          </div>
          <div className="border-l-2 border-white pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">SOL Holdings</p>
            <p className="text-lg md:text-xl font-bold">{solBalance.toFixed(4)} SOL</p>
            <p className="text-xs text-neutral-500 mt-1">≈ {formatInr(solValueInr)}</p>
          </div>
          <div className="border-l-2 border-neutral-700 pl-4">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">SOL Price</p>
            <p className="text-lg md:text-xl font-bold">{formatInr(solPriceInr)}</p>
            <p className="text-xs text-neutral-500 mt-1">Live</p>
            <p className="text-lg md:text-xl font-bold text-white">{formatInr(0)}</p>
            <p className="text-xs text-neutral-500 mt-1">Not available</p>
          </div>
        </div>
      </div>
    </div>
  )
}
