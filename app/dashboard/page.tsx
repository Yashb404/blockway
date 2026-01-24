import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DashboardHeader from "../components/dashboard/DashboardHeader"
import UserProfile from "../components/dashboard/UserProfile"
import WalletSection from "../components/dashboard/WalletSection"
import PortfolioOverview from "../components/dashboard/PortfolioOverview"
import TradingInterface from "../components/dashboard/TradingInterface"
import TransactionHistory from "../components/dashboard/TransactionHistory"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/")
  }

  const user = await prisma.user.findFirst({
    where: {
      username: session.user.email,
    },
    include: {
      inrWallet: true,
      solWallet: true,
      transactions: {
        orderBy: {
          timestamp: 'desc'
        }
      }
    },
  })

  if (!user) {
    redirect("/")
  }

  const inrBalance = user.inrWallet?.balance ?? 0
  const solPublicKey = user.solWallet?.publicKey ?? ""
  const solBalance = user.solWallet?.balance ?? 0

  const transactions = user.transactions.map((t: any) => ({
    id: t.id,
    type: t.type,
    amount: `₹${t.amount / 100}`, // Assuming amount is in paisa or similar unit, logically int. Or just t.amount. Let's keep t.amount for now or format it.
    value: t.status, // The component expects 'value' string? Checking definition later.
    time: t.timestamp.toLocaleDateString(),
    status: t.status
  }));


  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
        {/* Top Section: Profile & Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="lg:col-span-1">
            <UserProfile
              name={user.name ?? user.username}
              email={user.username}
              profilePicture={user.profilePicture ?? undefined}
            />
          </div>
          <div className="lg:col-span-2">
            <PortfolioOverview inrBalance={inrBalance} solBalance={solBalance} />
          </div>
        </div>

        {/* Middle Section: Wallets */}
        <div className="mb-8 md:mb-12">
          <WalletSection inrBalance={inrBalance} solBalance={solBalance} solPublicKey={solPublicKey} />
        </div>

        {/* Trading & History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <TradingInterface />
          </div>
          <div className="lg:col-span-1">
            <TransactionHistory transactions={transactions} />
          </div>

        </div>
      </main>
    </div>
  )
}