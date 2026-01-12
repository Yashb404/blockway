'use client';

import { signIn } from "next-auth/react";

export default function LoginSection() {
  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  return (
    <div className="w-full space-y-4">
      <button
        onClick={handleGoogleSignIn}
        className="w-full px-8 py-3 bg-white text-black font-mono font-bold rounded-none hover:bg-black hover:text-white hover:border-white transition-all duration-300 uppercase tracking-wide text-sm border-2 border-white"
      >
        Sign In with Google
      </button>
    </div>
  );
}
