"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Search, 
  ExternalLink,
  ChevronRight,
  Heart,
  TrendingUp
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { FeedbackSystem } from "@/components/reputation/FeedbackSystem";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";



export default function HistoryPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [ratingTarget, setRatingTarget] = useState<{ id: string, name: string, case: string } | null>(null);
  
  const isDonor = user?.role === "Donor";
  const isRequester = user?.role === "Requester";

  const transactions = [
    { id: 1, type: "Contribution", target: "Surgery for Rahul", amount: -50, date: "2 hours ago", status: "Successful", isSecure: true, hash: "SC-7A2B4E", donorId: "u1" },
    { id: 2, type: "Contribution", target: "Kerala Flood Relief", amount: -100, date: "1 day ago", status: "Successful", isSecure: true, hash: "SC-3D4A1C", donorId: "u2" },
    { id: 3, type: "Refund", target: "Project Cancelled", amount: 500, date: "3 days ago", status: "Successful", isSecure: true, hash: "SC-9E1F5D" },
    { id: 4, type: "Contribution", target: "STEM Scholarship", amount: -25, date: "5 days ago", status: "Successful", isSecure: true, hash: "SC-2C4B8F", donorId: "u1" },
    // If requester, show received aid
    ...(isRequester ? [
      { id: 5, type: "Aid Received", target: "Medical Support", amount: 500, date: "1 week ago", status: "Successful", isSecure: true, hash: "SC-RAID1", donorId: "u1", donorName: "Sanjay Kumar" }
    ] : [])
  ];


  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center">
                <History className="w-10 h-10 mr-4 text-blue-600" />
                {t("nav.history")}
              </h1>
              <p className="text-slate-500 mt-2 font-medium">Your personal impact journey and contribution history.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search history..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
            </div>
          </div>

          <div className="space-y-5">
            {transactions.map((tx) => (
              <div key={tx.id} className="glass-card p-6 rounded-[2rem] flex items-center justify-between group hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-xl">
                <div className="flex items-center space-x-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                    tx.amount < 0 ? "bg-rose-500/10 text-rose-500" : "bg-green-500/10 text-green-500"
                  )}>
                    {tx.amount < 0 ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-lg tracking-tight">{tx.type}: {tx.target}</h3>
                      {tx.isSecure && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center border border-blue-500/20">
                          <ShieldCheck className="w-3 h-3 mr-1 fill-current" />
                          SECURE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 font-bold">{tx.date} • ID: {tx.hash}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <div className={cn(
                      "text-2xl font-black tracking-tight",
                      tx.amount < 0 ? "text-slate-900 dark:text-white" : "text-green-500"
                    )}>
                      {tx.amount > 0 ? "+" : ""}{formatCurrency(tx.amount)}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 flex items-center justify-end tracking-widest uppercase">
                      {tx.status} <ExternalLink className="w-3 h-3 ml-1.5" />
                    </div>
                  </div>
                  
                  {isRequester && tx.type === "Aid Received" && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRatingTarget({ id: tx.donorId || "u1", name: (tx as any).donorName || "Donor", case: tx.target });
                      }}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center space-x-2"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Rate Donor</span>
                    </button>
                  )}

                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Achievement Card */}
          <div className="mt-16 p-10 bg-slate-900 dark:bg-slate-900 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
              <Heart className="w-48 h-48 fill-current" />
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold text-sm">Community Leader</span>
                </div>
                <h3 className="text-4xl font-black mb-4 tracking-tight">Your Impact Summary</h3>
                <p className="text-slate-400 text-lg mb-0 max-w-md font-medium leading-relaxed">You've directly impacted over <strong>24 lives</strong> and supported 3 different categories of aid.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Total Contributions</div>
                  <div className="text-3xl font-black">₹1,450</div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Verified Impact</div>
                  <div className="text-3xl font-black">100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {ratingTarget && (
        <FeedbackSystem 
          donorId={ratingTarget.id}
          donorName={ratingTarget.name}
          caseTitle={ratingTarget.case}
          onClose={() => setRatingTarget(null)}
        />
      )}

      <Footer />

    </div>
  </ProtectedRoute>
  );
}
