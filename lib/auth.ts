import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { generateKeyPair, getAddressFromPublicKey } from "@solana/kit"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const userEmail = user.email
        if (!userEmail) {
          return false
        }

        const userExists = await prisma.user.findFirst({
          where: {
            username: userEmail,
          },
        })

        if (userExists) {
          return true
        }

        // We generate the keypair using native Web Crypto API to ensure it is marked as 'extractable'.
        // The helper `generateKeyPair` from @solana/kit might default to non-extractable keys for security.
        const keyPair = (await crypto.subtle.generateKey(
          "Ed25519",
          true, // extractable
          ["sign", "verify"]
        )) as CryptoKeyPair

        const publicKey = await getAddressFromPublicKey(keyPair.publicKey)
        // Export the private key to a format we can store (PKCS8 for Ed25519 private keys)
        const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
        const privateKey = new Uint8Array(exportedPrivateKey).toString()

        await prisma.user.create({
          data: {
            username: userEmail,
            name: profile?.name,
            // @ts-ignore
            profilePicture: profile?.picture,
            provider: "Google",
            solWallet: {
              create: {
                publicKey,
                privateKey,
              },
            },
            inrWallet: {
              create: {
                balance: 0,
              },
            },
          },
        })

        return true
      }

      return false
    },
  },
  pages: {
    signIn: "/",
  },
}
