'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import UserProfile from "../components/dashboard/UserProfile";
import PortfolioOverview from "../components/dashboard/PortfolioOverview";
import WalletSection from "../components/dashboard/WalletSection";
import TradingInterface from "../components/dashboard/TradingInterface";
import TransactionHistory from "../components/dashboard/TransactionHistory";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-sm tracking-widest font-mono uppercase">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardHeader />

      <main className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Top Section: Profile & Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="lg:col-span-1">
            <UserProfile />
          </div>
          <div className="lg:col-span-2">
            <PortfolioOverview />
          </div>
        </div>

        {/* Middle Section: Wallets */}
        <div className="mb-8 md:mb-12">
          <WalletSection />
        </div>

        {/* Trading & History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <TradingInterface />
          </div>
          <div className="lg:col-span-1">
            <TransactionHistory />
          </div>
        </div>
      </main>
    </div>
  );
}