"use client"

import { ArrowRightLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { executeSwapInrToSol, executeSwapSolToInr } from "@/app/dashboard/swap/actions"

export default function TradingInterface() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [price, setPrice] = useState<number>(0)
  const [amount, setAmount] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // USD to INR Rate (Hardcoded for demo, or fetch API)
  const [rate, setRate] = useState(86.5);

  useEffect(() => {
    // Poll price
    const fetchPrice = async () => {
        try {
            const res = await fetch('/api/jupiter?type=price');
            const data = await res.json();
            if (data.rate) setRate(data.rate);
            if (data.price) setPrice(data.price * (data.rate || 86.5));
        } catch (e) { console.error(e); }
    };
    fetchPrice();
    const i = setInterval(fetchPrice, 10000);
    return () => clearInterval(i);
  }, []);

  const exchangeRate = price > 0 ? price : 14000; // Fallback
  
  const outputAmount = amount && !isNaN(parseFloat(amount)) 
    ? (tradeType === "buy" ? parseFloat(amount) / exchangeRate : parseFloat(amount) * exchangeRate)
    : 0;

  async function handleExecute() {
     setLoading(true);
     setMessage("");
     
     const formData = new FormData();
     formData.append("amount", amount);

     let res;
     if (tradeType === "buy") {
         res = await executeSwapInrToSol(formData);
     } else {
         res = await executeSwapSolToInr(formData);
     }

     if (res.error) {
         setMessage(res.error);
     } else {
         setMessage("Transaction Successful!");
         setAmount("");
     }
     setLoading(false);
  }

  const formatCurrency = (val: number) => 
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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

        {/* To Input (ReadOnly) */}
        <div>
          <label className="text-xs text-neutral-400 uppercase tracking-wide mb-2 block">
            You Receive ({tradeType === "buy" ? "SOL" : "INR"})
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={outputAmount ? (tradeType === "buy" ? outputAmount.toFixed(4) : outputAmount.toFixed(2)) : "0.00"}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-lg font-semibold placeholder-neutral-600 focus:outline-none text-neutral-400 cursor-not-allowed"
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
            <span className="font-semibold">1 SOL = {formatCurrency(exchangeRate)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Fee (0%)</span>
            <span className="font-semibold">₹0.00</span>
          </div>
          <div className="h-px bg-neutral-800"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Total</span>
            <span className="font-bold">{tradeType === 'buy' ? formatCurrency(parseFloat(amount)||0) : `${amount||0} SOL`}</span>
          </div>
        </div>
        
        {message && (
            <div className={`p-3 rounded text-sm ${message.includes("Success") ? "bg-green-900/50 text-green-200" : "bg-red-900/50 text-red-200"}`}>
                {message}
            </div>
        )}

        {/* Execute Button */}
        <button 
           onClick={handleExecute}
           disabled={loading || !amount}
           className="w-full bg-white text-black font-bold py-4 rounded text-lg hover:bg-neutral-200 transition-colors mt-6 disabled:opacity-50"
        >
          {loading ? "Processing..." : (tradeType === "buy" ? "Buy SOL" : "Sell SOL")}
        </button>

        <p className="text-xs text-neutral-500 text-center">
          Transaction requires confirmation. All amounts are verified server-side.
        </p>
      </div>
    </div>
  )
}
