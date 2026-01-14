import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { Keypair } from "@solana/web3.js";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
    async signIn({user,account,profile,email,credentials}){
      if (account?.provider === "google"){
        const userEmail = user.email;
        if (!userEmail){
          return false
        }

        const userExists = await prisma.user.findFirst({
          where: {
            username: userEmail
          }
        }); 
        
        if (userExists) {
          return true;
        }

        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();
        const privateKey = keypair.secretKey;

        await prisma.user.create({
          data:{
            username: userEmail,
            provider: "Google",
            solWallet:{
              create:{
                publicKey: publicKey,
                privateKey: privateKey.toString()
              }
            },
            inrWallet:{
              create: {
                balance: 0
              }
            }
          }
        })
        
        return true;
      }

      return false
    },
  },
  pages: {
    signIn: '/',
  }
})

export { handler as GET, handler as POST }
