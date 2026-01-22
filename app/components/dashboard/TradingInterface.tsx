"use client"

import { ArrowRightLeft } from "lucide-react"
import { useState } from "react"

export default function TradingInterface() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-bold mb-8">Trade</h3>

      {/* Trade Type Toggle */}
      <div className="flex gap-4 mb-8 border-b border-neutral-800 pb-6">
        <button
          onClick={() => setTradeType("buy")}
          className={`text-sm md:text-base font-semibold uppercase tracking-wide pb-3 border-b-2 transition-colors ${
            tradeType === "buy" ? "border-white text-white" : "border-transparent text-neutral-500 hover:text-white"
          }`}
        >
          Buy SOL
        </button>
        <button
          onClick={() => setTradeType("sell")}
          className={`text-sm md:text-base font-semibold uppercase tracking-wide pb-3 border-b-2 transition-colors ${
            tradeType === "sell" ? "border-white text-white" : "border-transparent text-neutral-500 hover:text-white"
          }`}
        >
          Sell SOL
        </button>
      </div>

      <div className="space-y-6">
        {/* From Input */}
        <div>
          <label className="text-xs text-neutral-400 uppercase tracking-wide mb-2 block">
            {tradeType === "buy" ? "You Pay (INR)" : "You Sell (SOL)"}
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-lg font-semibold placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">
              {tradeType === "buy" ? "₹" : "SOL"}
            </span>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="flex items-center justify-center">
          <div className="bg-neutral-900 p-3 rounded-full border border-neutral-800">
            <ArrowRightLeft size={18} className="text-neutral-400" />
          </div>
        </div>

        {/* To Input */}
        <div>
          <label className="text-xs text-neutral-400 uppercase tracking-wide mb-2 block">
            You Receive ({tradeType === "buy" ? "SOL" : "INR"})
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-lg font-semibold placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">
              {tradeType === "buy" ? "SOL" : "₹"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-neutral-900 rounded p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Exchange Rate</span>
            <span className="font-semibold">1 SOL = ₹6,384.35</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Fee (0.5%)</span>
            <span className="font-semibold">₹0.00</span>
          </div>
          <div className="h-px bg-neutral-800"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Total</span>
            <span className="font-bold">₹0.00</span>
          </div>
        </div>

        {/* Execute Button */}
        <button className="w-full bg-white text-black font-bold py-4 rounded text-lg hover:bg-neutral-200 transition-colors mt-6">
          {tradeType === "buy" ? "Buy SOL" : "Sell SOL"}
        </button>

        <p className="text-xs text-neutral-500 text-center">
          Transaction requires confirmation. All amounts are verified server-side.
        </p>
      </div>
    </div>
  )
}
