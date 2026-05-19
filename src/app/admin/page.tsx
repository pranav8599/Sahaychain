"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Lock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


export default function AdminPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState([
    { id: 1, title: "Heart Surgery - Rahul", user: "0x12...34", category: "Medical", docs: 3, status: "Pending" },
    { id: 2, title: "STEM Scholarship", user: "0xab...cd", category: "Education", docs: 5, status: "Pending" },
    { id: 3, title: "Relief Camp - East", user: "0x56...78", category: "Disaster", docs: 2, status: "In Review" },
  ]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Restricted</span>
              </div>
              <h1 className="text-3xl font-bold">Verification Portal</h1>
              <p className="text-slate-500 text-sm mt-1">Logged in as {user?.fullName || "Administrator"}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-blue-500/10 text-blue-600 rounded-xl font-bold text-sm border border-blue-500/20">
                12 New Requests
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <h2 className="font-bold">Pending Verifications</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"><Filter className="w-4 h-4" /></button>
                    <button className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"><Search className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {requests.map((req) => (
                    <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                          <Eye className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-bold">{req.title}</h3>
                          <p className="text-xs text-slate-500">By {req.user} • {req.docs} Documents uploaded</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={cn(
                          "text-xs font-bold px-3 py-1 rounded-full",
                          req.status === "Pending" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"
                        )}>{req.status}</span>
                        <div className="flex space-x-2">
                          <button className="p-2 bg-green-500/10 text-green-600 rounded-xl hover:bg-green-500/20 transition-colors">
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-500/20 transition-colors">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card rounded-3xl p-8">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                  System Integrity
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    <div className="text-sm font-medium text-slate-500 mb-1">Verification Accuracy</div>
                    <div className="text-2xl font-bold text-green-500">99.8%</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    <div className="text-sm font-medium text-slate-500 mb-1">Avg. Response Time</div>
                    <div className="text-2xl font-bold">14.2 Hours</div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                <ShieldCheck className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Security Guidelines</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Ensure all medical reports are cross-checked with hospital databases before approval.
                </p>
                <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold">Read Protocol</button>
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
