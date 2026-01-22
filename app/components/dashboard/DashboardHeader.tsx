import { LogOut, Settings } from "lucide-react"

export default function DashboardHeader() {
  return (
    <header className="border-b border-neutral-900 bg-black">
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 flex items-center justify-between">
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
          <button className="p-2 hover:bg-neutral-900 rounded transition-colors">
            <LogOut size={20} />
          </button>
        </nav>
      </div>
    </header>
  )
}
