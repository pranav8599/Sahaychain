"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Activity, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ExternalLink,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


export default function TrackingPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const activities = [
    { id: 1, case: "Surgery for Rahul", amount: "₹12,500", status: "Completed", date: "May 14, 2026", idToken: "SC-7A2B4E", type: "Distribution" },
    { id: 2, case: "Kerala Flood Relief", amount: "₹45,000", status: "Secure Escrow", date: "May 12, 2026", idToken: "SC-3D4A1C", type: "Contribution" },
    { id: 3, case: "STEM Scholarship", amount: "₹8,000", status: "Allocated", date: "May 10, 2026", idToken: "SC-9E1F5D", type: "Allocation" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black mb-4 tracking-tight">{t("common.realTimeTracking")}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Verify the movement of funds from contributors to beneficiaries with complete transparency.</p>
          </div>

          {/* Secure Activity Table */}
          <div className="glass-card rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Activity className="w-6 h-6 mr-3 text-blue-500" />
                Trusted Fund Flow
              </h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Search by Secure ID..." className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Beneficiary Case</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Type</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Amount</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Safety Status</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Certificate ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900 dark:text-white">{act.case}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{act.type}</span>
                      </td>
                      <td className="px-8 py-6 font-black text-lg text-blue-600">{act.amount}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          {act.status === "Completed" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500" />
                          )}
                          <span className={cn(
                            "text-sm font-bold",
                            act.status === "Completed" ? "text-green-600" : "text-amber-600"
                          )}>{act.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500 font-medium">{act.date}</td>
                      <td className="px-8 py-6">
                        <button className="flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 transition-colors text-sm font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <span>{act.idToken}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline & Assurance */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-3xl font-black mb-10 tracking-tight">How we ensure <span className="text-blue-600">Trust</span></h2>
              <div className="space-y-10">
                {[
                  { step: "Contribution Receipt", desc: "Funds are securely pooled in a protected community vault.", status: "completed" },
                  { step: "Community Audit", desc: "Multisig verification ensures legitimacy of the request.", status: "completed" },
                  { step: "Milestone Release", desc: "Funds are released in phases based on verified progress.", status: "active" },
                  { step: "Impact Proof", desc: "Evidence of utilization is recorded before final distribution.", status: "pending" },
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6 relative">
                    {i < 3 && <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2" />}
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-lg transition-transform hover:scale-110",
                      item.status === "completed" ? "bg-green-500 text-white" : item.status === "active" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    )}>
                      {item.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">{item.step}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-8">
              <div className="glass-card rounded-[3rem] p-10 flex flex-col justify-center items-center text-center flex-grow shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-600/10 transition-all" />
                <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                  <ShieldCheck className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Unmatched Security</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm font-medium leading-relaxed">We use state-of-the-art secure ledgers to ensure your contributions are immutable and protected.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Secure Protocol</div>
                  <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Audit Ready</div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex items-center justify-between group">
                <div>
                  <h4 className="text-xl font-bold mb-2 tracking-tight">Need verification details?</h4>
                  <p className="text-slate-400 text-sm font-medium">Download full audit reports for any case.</p>
                </div>
                <button className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all group-hover:translate-x-2">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </ProtectedRoute>
  );
}
