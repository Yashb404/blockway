import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

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
      const email = user.email;
      if (!email){
        return false
      }
      return true}

      return false
    },
  },
  pages: {
    signIn: '/',
  }
})

export { handler as GET, handler as POST }
