"use client"

import { useState } from "react"
import { LogOut, X, Eye, EyeOff, ShieldAlert, Wallet, Moon, Sun, DollarSign } from "lucide-react"
import { signOut } from "next-auth/react"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [showKey, setShowKey] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD')

  if (!isOpen) return null

  // TODO: Determine key to show (mock or logic to fetch later)
  const privateKeyDisplay = showKey 
    ? "5M......(YourPrivateKeyHere)......" 
    : "••••••••••••••••••••••••••••••••••••••"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Dialog Content */}
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Section: Appearance */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm font-medium text-neutral-400 uppercase tracking-wider">
              <Sun size={16} />
              Appearance
            </div>
            
            <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-lg border border-neutral-800">
              <span className="text-sm font-medium text-white">Theme</span>
              <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-md transition-all ${
                    theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sun size={16} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-md transition-all ${
                    theme === 'dark' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Moon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Preferences */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm font-medium text-neutral-400 uppercase tracking-wider">
              <DollarSign size={16} />
              Preferences
            </div>
            
             <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-lg border border-neutral-800">
              <span className="text-sm font-medium text-white">Default Currency</span>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'INR')}
                className="bg-neutral-900 text-white text-sm border border-neutral-800 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-700"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

          {/* Section: Security */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-400 uppercase tracking-wider">
              <Wallet size={16} />
              Wallet Security
            </div>
            <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">Private Key</span>
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="bg-neutral-900 p-2 rounded text-xs font-mono text-neutral-500 break-all select-all">
                {privateKeyDisplay}
              </div>
            </div>
          </div>

          {/* Section: Account */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-400 uppercase tracking-wider">
              <ShieldAlert size={16} />
              Account
            </div>
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all hover:border-red-500/40"
            >
              <span className="font-medium">Sign Out</span>
              <LogOut size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}