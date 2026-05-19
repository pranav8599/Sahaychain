"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router, pathname]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-gradient animate-pulse">SahayChain</h2>
        <p className="mt-2 text-slate-500 font-medium tracking-wide uppercase text-[10px]">Verifying Session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
