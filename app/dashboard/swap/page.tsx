
"use client";

import { useState, useEffect } from "react";
import { executeSwapInrToSol, executeOnChainSwap } from "./actions";
import { ArrowDownUp, RefreshCw } from "lucide-react";

const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export default function SwapPage() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"fiat" | "crypto">("crypto"); // 'fiat' = INR->SOL, 'crypto' = SOL->USDC
  
  // Quote State
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [estimating, setEstimating] = useState(false);

  // Poll for price
  useEffect(() => {
    const fetchPrice = async () => {
        try {
            const res = await fetch('/api/jupiter?type=price');
            const data = await res.json();
            if (data.price) setPrice(data.price);
        } catch (e) { console.error("Failed price fetch"); }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Quote when amount changes (Debounced)
  useEffect(() => {
      if (mode === "fiat" || !amount || isNaN(parseFloat(amount))) return;
      
      const timeoutId = setTimeout(async () => {
          setEstimating(true);
          try {
             // Amount in Lamports (assuming input is SOL)
             // 1 SOL = 10^9 Lamports
             const amountLamports = Math.floor(parseFloat(amount) * 1_000_000_000);
             
             const params = new URLSearchParams({
                 type: 'quote',
                 inputMint: SOL_MINT,
                 outputMint: USDC_MINT,
                 amount: amountLamports.toString(),
                 slippageBps: "50"
             });

             const res = await fetch(`/api/jupiter?${params}`);
             const data = await res.json();
             
             if (data.error) throw new Error(data.error);
             setQuote(data);
          } catch (e) {
              console.error("Quote error", e);
              setQuote(null);
          } finally {
              setEstimating(false);
          }
      }, 600);

      return () => clearTimeout(timeoutId);
  }, [amount, mode]);

  async function handleSwap(formData: FormData) {
      setLoading(true);
      setMessage("");
      
      if (mode === "fiat") {
          // Internal DB Swap
          const result = await executeSwapInrToSol(formData);
          if (result.error) setMessage(`Error: ${result.error}`);
          else setMessage(`Success: ${result.message}`);
      } else {
          // On-Chain Jupiter Swap
          if (!quote) {
              setMessage("Error: No quote available");
              setLoading(false);
              return;
          }
          
          try {
              const result = await executeOnChainSwap(quote);
              if (result.error) setMessage(`Error: ${result.error}`);
              else setMessage(`Success! TX: ${result.txid}`);
          } catch (e: any) {
              setMessage(`Error: ${e.message}`);
          }
      }
      setLoading(false);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto text-white">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Swap</h1>
            <div className="bg-neutral-800 p-1 rounded-lg flex text-sm font-medium">
                <button 
                  onClick={() => { setMode("crypto"); setQuote(null); }}
                  className={`px-3 py-1.5 rounded-md transition-all ${mode === "crypto" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-white"}`}
                >
                  SOL → USDC
                </button>
                <button 
                  onClick={() => setMode("fiat")}
                  className={`px-3 py-1.5 rounded-md transition-all ${mode === "fiat" ? "bg-emerald-600 text-white" : "text-neutral-400 hover:text-white"}`}
                >
                  INR → SOL
                </button>
            </div>
        </div>
        
        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
            {price && (
                <div className="mb-6 flex items-center justify-between text-sm text-neutral-400">
                    <span>Market Price</span>
                    <span className="text-emerald-400 font-mono">1 SOL ≈ ${price.toFixed(2)}</span>
                </div>
            )}

            <form action={handleSwap} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        {mode === "fiat" ? "Pay (INR)" : "Sell (SOL)"}
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-neutral-400">
                            {mode === "fiat" ? "₹" : "◎"}
                        </span>
                        <input 
                            name="amount" 
                            type="number" 
                            required
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={mode === "fiat" ? "1000" : "0.5"}
                            className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-8 pr-4 focus:ring-2 focus:ring-neutral-700 outline-none" 
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="bg-neutral-800 p-2 rounded-full text-neutral-400">
                        <ArrowDownUp size={20} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Receive ({mode === "fiat" ? "Estimated SOL" : "USDC"})
                    </label>
                    <div className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-3 px-4 text-neutral-400 flex justify-between items-center">
                        {mode === "fiat" ? (
                            <span>Calculated at execution</span>
                        ) : (
                            <>
                                {estimating ? (
                                    <span className="flex items-center gap-2"><RefreshCw className="animate-spin" size={14}/> Fetching best price...</span>
                                ) : quote ? (
                                    <span className="text-white font-mono">
                                        {(parseInt(quote.outAmount) / 1_000_000).toFixed(2)} USDC
                                    </span>
                                ) : (
                                    <span>Enter amount</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                
                {mode === "crypto" && quote && (
                    <div className="text-xs text-neutral-500 bg-black/50 p-3 rounded border border-neutral-800">
                        <div className="flex justify-between mb-1">
                            <span>Price Impact:</span>
                            <span className={parseFloat(quote.priceImpactPct) > 1 ? "text-red-400" : "text-emerald-400"}>
                                {parseFloat(quote.priceImpactPct) < 0.01 ? "< 0.01%" : `${quote.priceImpactPct}%`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Route:</span>
                            <span>Jupiter Aggregator</span>
                        </div>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading || (mode === "crypto" && !quote)}
                    className={`w-full font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                        ${mode === "fiat" 
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                            : "bg-purple-600 hover:bg-purple-500 text-white"
                        }`}
                >
                    {loading ? "Processing..." : mode === "fiat" ? "Buy SOL" : "Swap on Chain"}
                </button>

                {message && (
                    <div className={`p-4 rounded-lg text-sm break-all ${message.startsWith("Error") ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    </div>
  )
}

