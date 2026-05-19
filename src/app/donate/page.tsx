"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, Filter, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CaseCard } from "@/components/ui/CaseCard";
import { useLanguage } from "@/context/LanguageContext";
import { cn, fetchWithRetry } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DonationModal } from "@/components/ui/DonationModal";


const mockCases = [
  {
    id: 1,
    title: "Support for Blind School Digital Lab",
    description: "Help us build a state-of-the-art computer lab for visually impaired students at Hope Academy.",
    category: "Education",
    raised: 15400,
    goal: 20000,
    donors: 85,
    timeLeft: "8 days",
    location: "Bangalore, India",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Post-Earthquake Reconstruction",
    description: "Rebuilding community centers and homes for survivors of the recent tremors in the Himalayan belt.",
    category: "Disaster",
    raised: 32000,
    goal: 100000,
    donors: 420,
    timeLeft: "45 days",
    location: "Nepal",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Advanced Dialysis for Senior Citizen",
    description: "Support Mr. Singh's ongoing dialysis treatment. He has been a community volunteer for 30 years.",
    category: "Medical",
    raised: 1200,
    goal: 5000,
    donors: 12,
    timeLeft: "3 days",
    location: "Punjab, India",
    image: "https://images.unsplash.com/photo-1579153192040-51c521ad7c10?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Reforestation Project: Green Belt",
    description: "Planting 10,000 native trees to restore the local ecosystem and provide shade in urban heat islands.",
    category: "Environment",
    raised: 4500,
    goal: 10000,
    donors: 156,
    timeLeft: "15 days",
    location: "Nairobi, Kenya",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Clean Water Wells for 5 Villages",
    description: "Providing sustainable clean water access to over 2,000 residents in arid regions.",
    category: "Community",
    raised: 18000,
    goal: 25000,
    donors: 210,
    timeLeft: "10 days",
    location: "Rajasthan, India",
    image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Wildlife Rescue & Rehabilitation",
    description: "Rescuing injured animals and rehabilitating them to be released back into the wild.",
    category: "Animals",
    raised: 6700,
    goal: 12000,
    donors: 94,
    timeLeft: "18 days",
    location: "Amazon Rainforest",
    image: "https://images.unsplash.com/photo-1535083376694-22d3288e7781?auto=format&fit=crop&q=80&w=800"
  }
];


export default function DonatePage() {
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);

  useEffect(() => {
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
    fetchCases();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen mesh-gradient">
        <Navbar />

        <main className="flex-grow pt-20 pb-32 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16 text-center"
            >
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Impact Catalog</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">{t("nav.donate")}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto italic">"Every contribution is a brick in the wall of humanity."</p>
            </motion.div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-6 mb-16">
              <div className="relative flex-grow group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by cause, name, or location..."
                  className="w-full pl-16 pr-6 py-6 rounded-[2rem] border border-white/10 glass-card focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg font-medium transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button className="flex items-center space-x-3 px-10 py-6 glass-card rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border border-white/10">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center space-x-3 px-10 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20">
                  <Zap className="w-5 h-5" />
                  <span>Quick Help</span>
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {isLoadingCases ? (
                <div className="col-span-full text-center py-10 text-slate-500">Loading verified cases...</div>
              ) : !Array.isArray(cases) || cases.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-500">No cases found.</div>
              ) : (
                cases.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CaseCard
                      {...c}
                      image={c.imageUrl || "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800"}
                      onClick={() => setSelectedCase(c)}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Reusable Donation Modal */}
        <AnimatePresence>
          {selectedCase && (
            <DonationModal
              selectedCase={selectedCase}
              onClose={() => setSelectedCase(null)}
            />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
