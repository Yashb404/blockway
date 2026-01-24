"use client"

import { Settings } from "lucide-react"
import { useState } from "react"
import SettingsDialog from "./SettingsDialog"

export default function DashboardHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <header className="border-b border-neutral-900 bg-black relative z-10">
        <div className="container mx-auto px-4 py-6 md:py-8 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white"></div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">VOID</h1>
          </div>

          <nav className="flex items-center gap-6 md:gap-8">
            <span className="text-sm text-neutral-400 hidden sm:inline">
              Status: <span className="text-emerald-500 font-semibold">Online</span>
            </span>
            
            <button 
              className="p-2 hover:bg-neutral-900 rounded transition-colors text-neutral-400 hover:text-white"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={20} />
            </button>
          </nav>
        </div>
      </header>
      
      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  )
}
