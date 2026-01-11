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
    <div className="min-h-screen bg-black text-white font-sans">
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-16 space-y-4">
          <h1 className="text-6xl font-black tracking-tighter">
            WELCOME
          </h1>
          <p className="text-sm tracking-widest font-mono text-gray-400 uppercase">
            System Status: ONLINE
          </p>
        </div>

        {/* User Info Card */}
        <div className="border-2 border-white rounded-none p-8 mb-12 bg-black space-y-6">
          <div>
            <p className="text-xs tracking-widest font-mono text-gray-400 uppercase mb-2">
              USER PROFILE
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="text-sm tracking-widest font-mono uppercase text-gray-400">Name</span>
                <span className="font-sans text-white">{session.data?.user?.name || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="text-sm tracking-widest font-mono uppercase text-gray-400">Email</span>
                <span className="font-sans text-white break-all">{session.data?.user?.email || "N/A"}</span>
              </div>
              {session.data?.user?.image && (
                <div className="flex items-center justify-between pt-3">
                  <span className="text-sm tracking-widest font-mono uppercase text-gray-400">Avatar</span>
                  <img
                    src={session.data.user.image}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-none border border-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Placeholder Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-2 border-white rounded-none p-6 space-y-4">
            <p className="text-xs tracking-widest font-mono uppercase text-gray-400">
              Feature 01
            </p>
            <h3 className="text-2xl font-black tracking-tight">
              Coming Soon
            </h3>
            <p className="text-sm text-gray-400">
              Placeholder for your next feature
            </p>
          </div>

          <div className="border-2 border-white rounded-none p-6 space-y-4">
            <p className="text-xs tracking-widest font-mono uppercase text-gray-400">
              Feature 02
            </p>
            <h3 className="text-2xl font-black tracking-tight">
              Coming Soon
            </h3>
            <p className="text-sm text-gray-400">
              Placeholder for your next feature
            </p>
          </div>

          <div className="border-2 border-white rounded-none p-6 space-y-4">
            <p className="text-xs tracking-widest font-mono uppercase text-gray-400">
              Feature 03
            </p>
            <h3 className="text-2xl font-black tracking-tight">
              Coming Soon
            </h3>
            <p className="text-sm text-gray-400">
              Placeholder for your next feature
            </p>
          </div>

          <div className="border-2 border-white rounded-none p-6 space-y-4">
            <p className="text-xs tracking-widest font-mono uppercase text-gray-400">
              Feature 04
            </p>
            <h3 className="text-2xl font-black tracking-tight">
              Coming Soon
            </h3>
            <p className="text-sm text-gray-400">
              Placeholder for your next feature
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
