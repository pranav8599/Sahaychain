"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CaseCard } from "@/components/ui/CaseCard";
import { Users, AlertTriangle, Globe, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { fetchWithRetry } from "@/lib/utils";
import { DonationModal } from "@/components/ui/DonationModal";
import { AnimatePresence } from "framer-motion";


const mockReliefCases = [
  {
    id: "mock-disaster-1",
    title: "Cyclone Relief 2026",
    description: "Emergency shelter and medical supplies for communities affected by the coastal cyclone.",
    category: "Emergency",
    raised: 45000,
    goal: 100000,
    donors: 1200,
    timeLeft: "5 days",
    location: "Odisha, India",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "mock-disaster-2",
    title: "Wildfire Suppression Fund",
    description: "Supporting local firefighting units and animal rescue during the intense summer wildfires.",
    category: "Relief",
    raised: 8000,
    goal: 25000,
    donors: 85,
    timeLeft: "2 days",
    location: "California, USA",
    image: "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=800"
  }
];

export default function DisasterReliefPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [cases, setCases] = useState<any[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [selectedCaseToDonate, setSelectedCaseToDonate] = useState<any | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetchWithRetry("/api/cases");
        const data = await res.json();
        
        // Filter for Disaster, Disaster Relief, Emergency, or Relief
        const filtered = data.filter((c: any) => 
          c.category === "Disaster" || 
          c.category === "Disaster Relief" || 
          c.category === "Emergency" || 
          c.category === "Relief"
        );
        setCases(filtered);
      } catch (error) {
        console.error("Failed to fetch disaster relief cases:", error);
      } finally {
        setIsLoadingCases(false);
      }
    };
    fetchCases();
  }, []);

  // Combine fetched cases and mock cases, avoiding duplicates by title
  const displayedCases = [
    ...cases.map(c => ({
      ...c,
      image: c.imageUrl || "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800"
    })),
    ...mockReliefCases.filter(mock => !cases.some(c => c.title.toLowerCase() === mock.title.toLowerCase()))
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-16 h-16 bg-rose-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">{t("nav.disasterRelief")}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Rapid response for global emergencies and humanitarian aid.</p>
            </div>
          </div>

          <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Instant Trusted Deployment</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">All disaster relief contributions are priority-processed with zero platform friction.</p>
              </div>
            </div>
            <Link href="/donate" className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold hover:scale-105 transition-transform text-center">
              Donate Now
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingCases ? (
              <div className="col-span-full text-center py-10 text-slate-500">Loading disaster relief cases...</div>
            ) : displayedCases.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-500">No disaster cases available.</div>
            ) : (
              displayedCases.map((c, i) => (
                <CaseCard 
                  key={i} 
                  {...c} 
                  onClick={() => setSelectedCaseToDonate(c)}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>

    {/* Donation Overlay Modal */}
    <AnimatePresence>
      {selectedCaseToDonate && (
        <DonationModal
          selectedCase={selectedCaseToDonate}
          onClose={() => setSelectedCaseToDonate(null)}
        />
      )}
    </AnimatePresence>
    </ProtectedRoute>
  );
}
