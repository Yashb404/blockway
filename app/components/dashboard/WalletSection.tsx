"use client"

import { Copy, Send, Download } from "lucide-react"

export default function WalletSection() {

  return (
    <div className="space-y-6">
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold">INR Wallet</h3>
          <span className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1 rounded">Verified</span>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Balance</p>
            <p className="text-3xl md:text-4xl font-bold">₹45,000.00</p>
          </div>
          <div className="border-t border-neutral-800 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"><Download size={18} />Deposit</button>
            <button className="bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"><Send size={18} />Withdraw</button>
            <button className="border border-neutral-700 text-white font-semibold py-3 rounded hover:bg-neutral-900 transition-colors">History</button>
          </div>
        </div>
      </div>
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold">Solana Wallet</h3>
          <span className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1 rounded">Public Address</span>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">SOL Balance</p>
            <p className="text-3xl md:text-4xl font-bold">12.45 SOL</p>
            <p className="text-sm text-neutral-400 mt-1">≈ ₹79,532.50</p>
          </div>
          <div className="bg-neutral-900 rounded p-4 flex items-center justify-between">
            <code className="text-xs md:text-sm text-neutral-300 break-all">9B2F...7xK9</code>
            <button className="p-2 hover:bg-neutral-800 rounded transition-colors flex-shrink-0"><Copy size={16} /></button>
          </div>
          <div className="border-t border-neutral-800 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"><Send size={18} />Send SOL</button>
            <button className="bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors">Receive</button>
            <button className="border border-neutral-700 text-white font-semibold py-3 rounded hover:bg-neutral-900 transition-colors">Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}
