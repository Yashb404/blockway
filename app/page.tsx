'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Hero from "./components/Hero";
import LoginSection from "./components/LoginSection";
import Footer from "./components/Footer";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session.status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white font-sans">
      <main className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-12">
          {/* Hero Section */}
          <Hero />

          {/* Login Section */}
          <LoginSection />

          {/* Footer Text */}
          <Footer />
        </div>
      </main>
    </div>
  );
}
