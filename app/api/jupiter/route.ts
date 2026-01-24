
import { NextRequest, NextResponse } from "next/server";
import { getSolPriceInUsd, getQuote, getSwapTransaction, getUsdToInrRate } from "@/app/_lib/jupiter-api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'price' or 'quote'

  try {
    if (type === "price") {
        const [price, rate] = await Promise.all([
          getSolPriceInUsd(),
          getUsdToInrRate()
        ]);
        return NextResponse.json({ price, rate });
    }

    if (type === "quote") {
        const inputMint = searchParams.get("inputMint");
        const outputMint = searchParams.get("outputMint");
        const amount = searchParams.get("amount");
        const slippageBps = searchParams.get("slippageBps");

        if (!inputMint || !outputMint || !amount) {
            return NextResponse.json({ error: "Missing parameters for quote" }, { status: 400 });
        }

        const quote = await getQuote(inputMint, outputMint, amount, slippageBps ? parseInt(slippageBps) : 50);
        return NextResponse.json(quote);
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quoteResponse, userPublicKey } = body;

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const swapTransaction = await getSwapTransaction(quoteResponse, userPublicKey);
    return NextResponse.json(swapTransaction);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
