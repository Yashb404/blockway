"use client"

import { CheckCircle2 } from "lucide-react"
import { useMemo, useState } from "react"

type UserProfileProps = {
  name: string
  email: string
  profilePicture?: string
}

export default function UserProfile({ name, email, profilePicture }: UserProfileProps) {
  const [imageError, setImageError] = useState(false)
  const initials = name?.trim()?.charAt(0)?.toUpperCase() || "U"
  const imageUrl = useMemo(() => {
    if (!profilePicture) return ""
    if (profilePicture.startsWith("http://") || profilePicture.startsWith("https://")) {
      return profilePicture
    }
    return ""
  }, [profilePicture])
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8 h-full">
      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-800 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{initials}</span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-bold">{name}</h2>
            <p className="text-sm text-neutral-400">{email}</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 size={14} className="text-white" />
              <span className="text-xs text-neutral-400">Verified</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-800"></div>

        {/* Quick Info */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Account Status</p>
            <p className="font-semibold">Active</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Member Since</p>
            <p className="font-semibold">Jan 15, 2024</p>
          </div>
        </div>

        {/* Button */}
        <button className="w-full bg-white text-black font-semibold py-3 rounded hover:bg-neutral-200 transition-colors mt-4">
          Edit Profile
        </button>
      </div>
    </div>
  )
}
