"use client"

import { LogOut, Settings } from "lucide-react"
import { signOut } from "next-auth/react"

export default function DashboardHeader() {
  return (
    <header className="border-b border-neutral-900 bg-black">
      <div className="container mx-auto px-4 py-6 md:py-8 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white"></div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">VOID</h1>
        </div>

        <nav className="flex items-center gap-6 md:gap-8">
          <span className="text-sm text-neutral-400">
            Status: <span className="text-white font-semibold">Online</span>
          </span>
          <button className="p-2 hover:bg-neutral-900 rounded transition-colors">
            <Settings size={20} />
          </button>
          <button
            className="p-2 hover:bg-neutral-900 rounded transition-colors"
            onClick={() => signOut()}
            aria-label="Log out"
          >
            <LogOut size={20} />
          </button>
        </nav>
      </div>
    </header>
  )
}
