'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black tracking-tighter">DASHBOARD</h1>
      </div>
    </div>
  );
}