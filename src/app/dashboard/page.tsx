"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Activity, Wallet, ShieldCheck, ArrowRight, CheckCircle2,
  Zap, Users, Trophy, TrendingUp, Star, Heart, Bell, BarChart2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CaseCard } from "@/components/ui/CaseCard";
import { ReputationCard } from "@/components/reputation/ReputationCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useReputation } from "@/context/ReputationContext";
import { useCertificate, CertificateData } from "@/context/CertificateContext";
import { CertificateModal } from "@/components/ui/CertificateModal";
import { cn, fetchWithRetry } from "@/lib/utils";
import Link from "next/link";
import { FileText, Download } from "lucide-react";

const mockAddress = "0x3A2F...8D1C";

const truncateAddress = (addr: string) => addr;

// Removed mockCases

const quickActions = [
  { label: "Donate Now", icon: Heart, href: "/donate", color: "bg-rose-500 shadow-rose-500/30" },
  { label: "Scholarships", icon: Star, href: "/scholarships", color: "bg-amber-500 shadow-amber-500/30" },
  { label: "Disaster Aid", icon: Zap, href: "/disaster-relief", color: "bg-blue-600 shadow-blue-600/30" },
  { label: "View History", icon: Activity, href: "/history", color: "bg-violet-600 shadow-violet-600/30" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { reputation } = useReputation();
  const { getUserCertificates } = useCertificate();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [pendingDonations, setPendingDonations] = useState<any[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);

  React.useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetchWithRetry("/api/cases");
        const data = await res.json();
        setCases(data);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
      } finally {
        setIsLoadingCases(false);
      }
    };

    const fetchPendingDonations = async () => {
      if (user?.role !== "Requester") return;
      try {
        const res = await fetchWithRetry(`/api/donations/pending?requesterId=${user.id}`);
        const data = await res.json();
        setPendingDonations(data);
      } catch (error) {
        console.error("Failed to fetch pending donations:", error);
      }
    };

    fetchCases();
    fetchPendingDonations();
  }, [user]);

  const handleVerifyDonation = async (donationId: string) => {
    try {
      const res = await fetchWithRetry("/api/donations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId, requesterId: user?.id })
      });
      if (res.ok) {
        setPendingDonations(prev => prev.filter(d => d.id !== donationId));
        alert("Donation verified successfully! The donor has received their certificate.");
      } else {
        alert("Failed to verify donation.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const displayCases = user?.role === "Requester" 
    ? (Array.isArray(cases) ? cases : []).filter((c: any) => c.creatorId === user.id) 
    : (Array.isArray(cases) ? cases : []).slice(0, 2);

  const userCertificates = user ? getUserCertificates(user.id) : [];

  const stats = [
    { label: "Trust Score", value: reputation?.trustScore ? `${reputation.trustScore}%` : "98%", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" },
    { label: "Total Impact", value: reputation?.totalDonated ? `₹${(reputation.totalDonated / 1000).toFixed(1)}k` : "₹12.4k", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
    { label: "Lives Touched", value: reputation?.verifiedHelpCount ? String(reputation.verifiedHelpCount) : "432", icon: Users, color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-900/20" },
    { label: "Global Rank", value: reputation?.rank ? `#${reputation.rank}` : "#142", icon: Trophy, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
        <Navbar />

        <main className="flex-grow pt-8 pb-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto space-y-12">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 bg-blue-500/10 px-4 py-1.5 rounded-full">
                  <Activity className="w-4 h-4" />
                  <span>{user?.role || "Member"} Dashboard</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-slate-900 dark:text-white">
                  Hello,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {user?.fullName?.split(" ")[0] || "User"}
                  </span>
                </h1>
                <p className="text-slate-500 text-xl font-medium max-w-lg">
                  Track your real-time impact and manage your global social contributions.
                </p>
              </motion.div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsWalletConnected(!isWalletConnected)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <span>{isWalletConnected ? truncateAddress(mockAddress) : "Connect Wallet"}</span>
                </button>
                <Link
                  href="/create"
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold bg-blue-600 text-white shadow-xl shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Case</span>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                >
                  <Link
                    href={action.href}
                    className={cn(
                      "flex items-center justify-center space-x-3 py-4 px-5 rounded-2xl text-white font-bold text-sm shadow-xl hover:-translate-y-1 transition-all duration-200",
                      action.color
                    )}
                  >
                    <action.icon className="w-5 h-5" />
                    <span>{action.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                
                {/* Pending Verifications for Requesters */}
                {user?.role === "Requester" && pendingDonations.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                      <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-400">Action Required: Verify Donations</h2>
                    </div>
                    <div className="space-y-4">
                      {pendingDonations.map(donation => (
                        <div key={donation.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                          <div>
                            <div className="text-sm font-bold text-slate-500 mb-1">Donation for: {donation.case.title}</div>
                            <div className="text-xl font-black text-amber-600">₹{donation.amount}</div>
                            <div className="text-xs text-slate-400 mt-2">
                              <strong>UTR:</strong> {donation.utr} <br/>
                              <strong>From:</strong> {donation.user?.fullName || "Anonymous Donor"}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a 
                              href={donation.screenshotUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                            >
                              View Proof
                            </a>
                            <button 
                              onClick={() => handleVerifyDonation(donation.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verify Receipt</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cases Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{user?.role === "Requester" ? "Your Active Cases" : "Recommended for You"}</h2>
                    <Link href="/donate" className="flex items-center text-sm font-bold text-blue-600 hover:underline">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  {isLoadingCases ? (
                    <div className="text-slate-500 py-8">Loading cases...</div>
                  ) : displayCases.length === 0 ? (
                    <div className="text-slate-500 py-8">
                      {user?.role === "Requester" ? "You haven't posted any cases yet." : "No active cases found."}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayCases.map((c, i) => (
                        <motion.div
                          key={c.id || i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <CaseCard 
                            {...c} 
                            image={c.imageUrl || "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"} 
                            href="/donate"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity Feed */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <BarChart2 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                  </div>
                  <div className="space-y-4">
                    {(() => {
                      const activities: any[] = [];
                      userCertificates.forEach(cert => {
                        activities.push({
                          text: `Your donation to '${cert.beneficiaryName}' was verified.`,
                          time: new Date(cert.date).toLocaleDateString(),
                          icon: ShieldCheck,
                          color: "text-emerald-500",
                          timestamp: new Date(cert.date).getTime()
                        });
                      });
                      if (user?.role === "Requester") {
                        displayCases.forEach(c => {
                          activities.push({
                            text: `You successfully posted the case: '${c.title}'.`,
                            time: new Date(c.createdAt || Date.now()).toLocaleDateString(),
                            icon: Plus,
                            color: "text-blue-500",
                            timestamp: new Date(c.createdAt || Date.now()).getTime()
                          });
                        });
                      }
                      
                      const recentActivities = activities
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, 4);
                        
                      if (recentActivities.length === 0) {
                        recentActivities.push({
                          text: "Welcome to SahayChain! Your activity will appear here.",
                          time: "Just now",
                          icon: Star,
                          color: "text-amber-500",
                          timestamp: Date.now()
                        });
                      }

                      return recentActivities.map((item, i) => (
                        <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className={cn("w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0", item.color)}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.text}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Tax Certificates */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-xl font-bold">Tax Benefit Certificates</h2>
                  </div>
                  {userCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userCertificates.map((cert) => (
                        <div key={cert.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col hover:border-blue-500/30 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(cert.date).toLocaleDateString()}</p>
                              <h3 className="font-bold text-slate-800 dark:text-slate-200 mt-1 truncate max-w-[150px]" title={cert.beneficiaryName}>{cert.beneficiaryName}</h3>
                            </div>
                            <div className="text-lg font-black text-emerald-600">₹{cert.amount}</div>
                          </div>
                          <button 
                            onClick={() => setSelectedCert(cert)}
                            className="mt-auto flex items-center justify-center space-x-2 w-full py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl text-sm font-bold transition-all"
                          >
                            <Download className="w-4 h-4" />
                            <span>View Document</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No certificates available yet. Make a verified donation to generate your first tax document.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Widgets */}
              <div className="lg:col-span-4 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ReputationCard reputation={reputation} />
                </motion.div>

                {/* Notifications Widget */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <div className="flex items-center space-x-3 mb-5">
                    <Bell className="w-5 h-5 text-violet-500" />
                    <h3 className="font-bold text-lg">Alerts</h3>
                    <span className="ml-auto px-2.5 py-0.5 bg-violet-500/10 text-violet-600 text-xs font-bold rounded-full">2 New</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { msg: "A new urgent medical case was posted near you.", dot: "bg-red-500" },
                      { msg: "Your leaderboard rank improved to #142!", dot: "bg-green-500" },
                    ].map((n, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", n.dot)} />
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{n.msg}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Widget */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20"
                >
                  <h3 className="font-bold text-lg mb-2">Want more impact?</h3>
                  <p className="text-blue-100 mb-6 text-sm">Join our top-tier contributors in global relief missions.</p>
                  <Link
                    href="/leaderboard"
                    className="block w-full py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors text-center"
                  >
                    View Opportunities
                  </Link>
                </motion.div>
              </div>
            </div>

          </div>
        </main>
        
        {/* Certificate Modal */}
        <AnimatePresence>
          {selectedCert && (
            <CertificateModal 
              data={selectedCert} 
              onClose={() => setSelectedCert(null)} 
            />
          )}
        </AnimatePresence>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}