const JUPITER_API_URL = "https://api.jup.ag";
const SOL_MINT = "So11111111111111111111111111111111111111112";

const headers = {
  "Content-Type": "application/json",
  "x-api-key": process.env.JUPITER_API_KEY || "",
};

export async function getUsdToInrRate(): Promise<number> {
  const key = process.env.CURRENCY_API_KEY;
  if (!key) return 91.0;

  try {
    const url = `https://currencyapi.net/api/v1/rates?key=${key}&base=USD&output=json`;
    const response = await fetch(url, { 
       headers: { 'Accept': 'application/json' },
       next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
        console.error(`Currency API Failed: ${response.status}`);
        return 91.0;
    }
    
    const data = await response.json();
    return data.rates?.INR || 91.0;
  } catch (error) {
    console.error("Currency API Error:", error);
    return 91.0;
  }
}

// 1. GET PRICE (Price API V3)
export async function getSolPriceInUsd(): Promise<number> {
  try {
    const response = await fetch(
      `${JUPITER_API_URL}/price/v3?ids=${SOL_MINT}`,
      { headers, next: { revalidate: 60 } }
    );
    
    if (!response.ok) throw new Error("Failed to fetch SOL price");
    
    const data = await response.json();
    return data[SOL_MINT]?.price || 0;
  } catch (error) {
    console.error("Jupiter Price API Error:", error);
    return 0;
  }
}

// 2. GET QUOTE (Swap V1)
export async function getQuote(inputMint: string, outputMint: string, amount: string, slippageBps = 50) {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount,
    slippageBps: slippageBps.toString()
  });

  const response = await fetch(`${JUPITER_API_URL}/swap/v1/quote?${params}`, {
    method: "GET",
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Quote Failed: ${err}`);
  }

  return response.json();
}

// 3. POST SWAP (Swap V1)
export async function getSwapTransaction(quoteResponse: any, userPublicKey: string) {
  const response = await fetch(`${JUPITER_API_URL}/swap/v1/swap`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      quoteResponse,
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true, // Recommended by Jupiter
      dynamicSlippage: true,         // Recommended by Jupiter
      prioritizationFeeLamports: {
        priorityLevelWithMaxLamports: {
          maxLamports: 1000000,
          priorityLevel: "veryHigh"
        }
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Swap Construction Failed: ${err}`);
  }

  return response.json();
}
