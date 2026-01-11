'use client';

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session.status, router]);

  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white font-sans">
      <main className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-8xl font-black tracking-tighter">
              BLOCKWAY
            </h1>
            <p className="text-sm tracking-widest font-mono text-gray-400 uppercase">
              Void & Paper Protocol
            </p>
          </div>

          {/* Login Section */}
          <div className="w-full space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full px-8 py-3 bg-white text-black font-mono font-bold rounded-none hover:bg-black hover:text-white hover:border-white transition-all duration-300 uppercase tracking-wide text-sm border-2 border-white"
            >
              Sign In with Google
            </button>
          </div>

          {/* Footer Text */}
          <div className="text-center">
           
          </div>
        </div>
      </main>
    </div>
  );
}
