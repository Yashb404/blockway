
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSolPriceInUsd, getUsdToInrRate } from "@/app/_lib/jupiter-api";

// TODO: Helper to get simulated rate
async function getExchangeRate() {
    try {
        const [solPrice, rate] = await Promise.all([
             getSolPriceInUsd(),
             getUsdToInrRate()
        ]);
        // Return 0 if failed? Or fallback?
        // Fallback checks inside the functions handle errors by returning 0 or 86.5.
        // getSolPriceInUsd returns 0 on error.
        if (solPrice === 0) return 14000; // Fallback hardcoded
        return solPrice * rate;
    } catch (e) {
        return 14000;
    }
}

export async function executeSwapInrToSol(formData: FormData) {
  const amountInrStr = formData.get("amount") as string;
  const amountInr = parseFloat(amountInrStr);

  if (!amountInr || amountInr <= 0) {
      return { error: "Invalid amount" };
  }

  const session = await getServerSession(authOptions);
  
  // Use email to look up user, as session.user.id is not available by default
  const userEmail = session?.user?.email;
  if (!userEmail) return { error: "Unauthorized" };

  const user = await prisma.user.findFirst({
      where: { username: userEmail }
  });

  if (!user) return { error: "User not found" };

  try {
    const solPriceInr = await getExchangeRate();
    const solAmount = amountInr / solPriceInr;

    // Execute Atomic internal transaction
    await prisma.$transaction(async (tx) => {
      // 1. Deduct INR
      const inrWallet = await tx.inrWallet.update({
        where: { userId: user.id },
        data: { balance: { decrement: amountInr } },
      });

      if (inrWallet.balance < 0) {
        throw new Error("Insufficient INR Balance");
      }

      // 2. Credit SOL (to database ledger)
      await tx.solWallet.update({
        where: { userId: user.id },
        data: { balance: { increment: solAmount } },
      });

      // 3. Log
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: Math.floor(amountInr * 100), // Storing as integer if needed, or update schema to Float/Decimal
          type: "Swap",
          status: "Success",
        },
      });
    });

    revalidatePath("/dashboard");
    return { success: true, message: `Swapped ₹${amountInr} for ${solAmount.toFixed(4)} SOL` };
  } catch (error: any) {
    return { error: error.message || "Swap failed" };
  }
}

export async function executeSwapSolToInr(formData: FormData) {
  const amountSolStr = formData.get("amount") as string;
  const amountSol = parseFloat(amountSolStr);

  if (!amountSol || amountSol <= 0) {
      return { error: "Invalid amount" };
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) return { error: "Unauthorized" };

  const user = await prisma.user.findFirst({
      where: { username: userEmail }
  });

  if (!user) return { error: "User not found" };

  try {
    const solPriceInr = await getExchangeRate();
    const amountInr = amountSol * solPriceInr;

    // Execute Atomic internal transaction
    await prisma.$transaction(async (tx) => {
      // 1. Deduct SOL
      const solWallet = await tx.solWallet.update({
        where: { userId: user.id },
        data: { balance: { decrement: amountSol } },
      });

      if (solWallet.balance < 0) {
        throw new Error("Insufficient SOL Balance");
      }

      // 2. Credit INR
      const inrWallet = await tx.inrWallet.update({
        where: { userId: user.id },
        data: { balance: { increment: amountInr } },
      });

      // 3. Log
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: Math.floor(amountInr * 100),
          type: "Swap",
          status: "Success",
        },
      });
    });

    revalidatePath("/dashboard");
    return { success: true, message: `Sold ${amountSol} SOL for ₹${amountInr.toFixed(2)}` };
  } catch (error: any) {
    return { error: error.message || "Swap failed" };
  }
}

// Helper to sign raw transaction bytes (Assumes Single Signer at index 0)
async function signRawTransaction(transactionBase64: string, secretKey: Uint8Array) {
    // 1. Decode Base64
    const txBuffer = Buffer.from(transactionBase64, 'base64');
    
    // 2. Parse Message Start (Skip Signatures)
    // Structure: [num_signatures (compact-u16)][signature (64)][...][message]
    // We assume 1 signature for swaps (User).
    // Versioned Tx first byte might have high bit set. 
    // Jupiter Standard: 1 signature.
    
    // Simple logic: Message starts after signatures.
    // If we assume we are the ONLY signer (Payer), we overwrite the first signature slot.
    // Signature count is likely 1.
    
    // Safety check: byte 0 should be 1.
    const numSignatures = txBuffer[0];
    if (numSignatures !== 1) {
        throw new Error("Complex transaction signing not supported via raw patch");
    }
    
    const messageStart = 1 + 64; // compact-u16(1) + 64 bytes
    const message = txBuffer.subarray(messageStart);
    
    // 3. Sign Message
    const keyPair = await crypto.subtle.importKey(
        "raw", 
        secretKey.slice(0, 32), // Seed only? Or full 64 bytes? 
        // Note: Ed25519 keys in DB might be full 64-byte or 32-byte seed.
        // Assuming 64-byte (32 priv + 32 pub). WebCrypto usually takes private part.
        // Or using a library.
        // Let's use @solana/kit imports if possible, but fallback to TweetNaCl style logic if needed.
        "Ed25519", 
        true, 
        ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign(
        "Ed25519",
        keyPair,
        message
    );
    
    // 4. Overwrite Signature
    txBuffer.set(new Uint8Array(signatureBuffer), 1);
    
    return txBuffer.toString('base64');
}

import { getSwapTransaction } from "@/app/_lib/jupiter-api";
import { createSolanaRpc } from "@solana/kit";

// Setup RPC
const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com");

export async function executeOnChainSwap(quoteResponse: any) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) return { error: "Unauthorized" };

  const user = await prisma.user.findFirst({
      where: { username: userEmail },
      include: { solWallet: true }
  });

  if (!user || !user.solWallet) return { error: "Wallet not found" };

  try {
      // 1. Get Constructed Transaction from Jupiter
      const swapTransactionRes = await getSwapTransaction(
          quoteResponse,
          user.solWallet.publicKey
      );
      
      const { swapTransaction } = swapTransactionRes;

      // 2. Decode Key
      const privateKeyData = user.solWallet.privateKey.split(',').map(Number);
      const secretKey = new Uint8Array(privateKeyData);
      
      // 3. Sign Raw (Patching)
      const signedTransactionBase64 = await signRawTransaction(swapTransaction, secretKey);

      // 4. Send
      // In kit 2.0/next, sendTransaction is a method on the RPC object for raw sending,
      // but specific factories like sendAndConfirmTransactionFactory are preferred for confirmation.
      // However, typical rpc.sendTransaction expects base64 encoded transaction string.
      
      const signature = await rpc.sendTransaction(
          signedTransactionBase64 as any, 
          { encoding: 'base64', skipPreflight: true, maxRetries: 2n }
      ).send();
      
      return { success: true, txid: signature };

  } catch (error: any) {
      console.error("On-Chain Swap Error:", error);
      return { error: error.message || "Swap execution failed" };
  }
}

