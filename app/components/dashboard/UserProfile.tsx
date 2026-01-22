import { User, Shield, CreditCard, ExternalLink } from "lucide-react"

export default function UserProfile() {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8 h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800">
          <User size={32} className="text-neutral-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Alex Chen</h2>
          <p className="text-sm text-neutral-400">Level 3 Trader</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-neutral-900 rounded border border-neutral-800">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-neutral-400" />
            <span className="font-medium">KYC Status</span>
          </div>
          <span className="text-sm bg-white text-black px-2 py-0.5 rounded font-bold">VERIFIED</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-900 rounded border border-neutral-800">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-neutral-400" />
            <span className="font-medium">Bank Account</span>
          </div>
          <span className="text-sm text-neutral-400">**** 4582</span>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-neutral-800">
        <button className="flex items-center justify-between w-full group">
          <span className="text-neutral-400 group-hover:text-white transition-colors">Account Settings</span>
          <ExternalLink size={16} className="text-neutral-600 group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  )
}
