'use client';
import { signIn, signOut, useSession } from "next-auth/react"

export const Appbar = () => {
    const session = useSession();
    
    return (
        <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center bg-black text-white w-full max-w-screen-2xl mx-auto">
            <div className="font-black text-lg tracking-tight">
                BLOCKWAY
            </div>
            <div>
                {session.data?.user ? (
                    <button
                        onClick={() => signOut()}
                        className="px-6 py-2 bg-white text-black font-mono font-bold rounded-none hover:bg-black hover:text-white hover:border-white transition-all duration-300 uppercase tracking-wide text-xs border-2 border-white"
                    >
                        Log Out
                    </button>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="px-6 py-2 bg-white text-black font-mono font-bold rounded-none hover:bg-black hover:text-white hover:border-white transition-all duration-300 uppercase tracking-wide text-xs border-2 border-white"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div>
    )
}