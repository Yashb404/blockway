"use client"

import { Copy, Send, Download } from "lucide-react"
import { useState, useEffect } from "react"

type WalletSectionProps = {
  inrBalance: number
  solBalance: number
  solPublicKey: string
}

const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value)

export default function WalletSection({ inrBalance, solBalance, solPublicKey }: WalletSectionProps) {
  const displayPublicKey = solPublicKey || "Not available"
  const [solValueInr, setSolValueInr] = useState(0);

  useEffect(() => {
     fetch('/api/jupiter?type=price')
        .then(r => r.json())
        .then(d => { if(d.price) setSolValueInr(d.price * (d.rate||86.5) * solBalance); })
        .catch(() => {});
  }, [solBalance]);

  return (
    <div className="space-y-6">
      {/* INR Wallet */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold">INR Wallet</h3>
          <span className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1 rounded">Verified</span>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Balance</p>
            <p className="text-3xl md:text-4xl font-bold">{formatInr(inrBalance)}</p>
          </div>

          <div className="border-t border-neutral-800 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
              <Download size={18} />
              Deposit
            </button>
            <button className="bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
              <Send size={18} />
              Withdraw
            </button>
            <button className="border border-neutral-700 text-white font-semibold py-3 rounded hover:bg-neutral-900 transition-colors">
              History
            </button>
          </div>
        </div>
      </div>

      {/* SOL Wallet */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold">Solana Wallet</h3>
          <span className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1 rounded">Public Address</span>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">SOL Balance</p>
            <p className="text-3xl md:text-4xl font-bold">{solBalance.toFixed(2)} SOL</p>
            <p className="text-sm text-neutral-400 mt-1">≈ {formatInr(solValueInr)}</p>
            <code className="text-xs md:text-sm text-neutral-300 break-all">{displayPublicKey}</code>
            <button className="p-2 hover:bg-neutral-800 rounded transition-colors shrink-0">
              <Copy size={16} />
            </button>
          </div>

          <div className="border-t border-neutral-800 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
              <Send size={18} />
              Send SOL
            </button>
            <button className="bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors">
              Receive
            </button>
            <button className="border border-neutral-700 text-white font-semibold py-3 rounded hover:bg-neutral-900 transition-colors">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
