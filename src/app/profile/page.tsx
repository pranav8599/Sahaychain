"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  User, 
  Settings, 
  Heart, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  Edit3,
  Copy,
  LogOut
} from "lucide-react";
import { useUGF } from "@/context/Web3Provider";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import { useLanguage } from "@/context/LanguageContext";
import { truncateAddress, formatCurrency, cn, fetchWithRetry } from "@/lib/utils";
import { useReputation } from "@/context/ReputationContext";
import { BadgeDisplay } from "@/components/reputation/BadgeDisplay";
import { ReputationCard } from "@/components/reputation/ReputationCard";
import { MessageSquare, Star, Save } from "lucide-react";


export default function ProfilePage() {
  const { mockUsdBalance } = useUGF();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const { reputation } = useReputation();
  const router = useRouter();
  
  const [upiId, setUpiId] = React.useState(user?.upiId || "");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (user?.upiId) {
      setUpiId(user.upiId);
    }
  }, [user]);

  const handleSaveUpi = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const res = await fetchWithRetry("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, upiId }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        // Just alert for now. Ideally update context user.
        alert("Payment Details Saved Successfully!");
        
        // Update localStorage
        const saved = localStorage.getItem("sahaychain_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.upiId = updatedUser.upiId;
          localStorage.setItem("sahaychain_user", JSON.stringify(parsed));
          window.location.reload();
        }
      } else {
        alert("Failed to save.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const mockAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 to-violet-600/20" />
            <div className="relative z-10">
              <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full mx-auto border-8 border-slate-50 dark:border-slate-950 flex items-center justify-center shadow-xl mb-6">
                <User className="w-16 h-16 text-slate-300" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{user?.fullName || "SahayChain Member"}</h1>
              <div className="flex items-center justify-center space-x-2 text-slate-500 mb-6">
                <span className="font-mono text-sm">{truncateAddress(mockAddress)}</span>
                <button className="p-1 hover:text-blue-600"><Copy className="w-4 h-4" /></button>
              </div>
              <div className="flex justify-center gap-4">
                <button className="flex items-center space-x-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 px-6 py-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-sm border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reputation Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold px-2">Reputation & Achievements</h2>
              <ReputationCard reputation={reputation} />
              
              {reputation && reputation.reviews.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold px-2 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Reviews & Feedback
                  </h3>
                  {reputation.reviews.map((review) => (
                    <div key={review.id} className="glass-card p-6 rounded-3xl">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "fill-current" : "text-slate-300 dark:text-slate-700")} />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{new Date(review.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 italic mb-4">"{review.feedback}"</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600">— {review.beneficiaryName}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{review.caseTitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Payment Details / Wallet */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold px-2">Payment Configuration</h2>
              <div className="glass-card p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                      <ShieldCheck className="w-7 h-7 fill-current" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-500">Manual Verification</div>
                      <div className="font-bold">Receiving Account</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold border border-green-500/20">Active</div>
                </div>
                
                <div className="mb-6 space-y-3">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Your UPI ID / Bank Details
                  </label>
                  <p className="text-xs text-slate-500">
                    Provide the UPI ID where you want to receive donations. This will be shown to donors during checkout.
                  </p>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@upi"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveUpi}
                    disabled={isSaving}
                    className="flex-grow flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save Payment Details"}</span>
                  </button>
                </div>
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
