"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CaseCard } from "@/components/ui/CaseCard";
import { GraduationCap, Award, BookOpen, Users, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { fetchWithRetry } from "@/lib/utils";
import { DonationModal } from "@/components/ui/DonationModal";
import { AnimatePresence } from "framer-motion";


const mockScholarships = [
  {
    id: "mock-1",
    title: "STEM Excellence Scholarship",
    description: "Supporting women in engineering and computer science with tuition and mentorship.",
    category: "Scholarship",
    raised: 12000,
    goal: 30000,
    donors: 45,
    timeLeft: "25 days",
    location: "Global",
    image: "https://images.unsplash.com/photo-152305085306e-8c3d3e7d4f1a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "mock-2",
    title: "Rural Arts Grant 2026",
    description: "Providing materials and training for traditional artists in remote villages.",
    category: "Art",
    raised: 5000,
    goal: 10000,
    donors: 32,
    timeLeft: "15 days",
    location: "India",
    image: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&q=80&w=800"
  }
];

export default function ScholarshipsPage() {
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
        
        // Filter for Scholarship, Scholarship Support, or Education
        const filtered = data.filter((c: any) => 
          c.category === "Scholarship" || 
          c.category === "Scholarship Support" || 
          c.category === "Education" || 
          c.category === "Art"
        );
        setCases(filtered);
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
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
      image: c.imageUrl || "https://images.unsplash.com/photo-152305085306e-8c3d3e7d4f1a?auto=format&fit=crop&q=80&w=800"
    })),
    ...mockScholarships.filter(mock => !cases.some(c => c.title.toLowerCase() === mock.title.toLowerCase()))
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">{t("nav.scholarships")}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Invest in the future leaders and innovators through verified grants.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { label: "Active Scholarships", value: "24", icon: BookOpen },
              { label: "Total Students", value: "156", icon: Users },
              { label: "Awards Distributed", value: "89", icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="p-8 rounded-3xl glass-card flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingCases ? (
              <div className="col-span-full text-center py-10 text-slate-500">Loading scholarships...</div>
            ) : displayedCases.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-500">No scholarships available.</div>
            ) : (
              displayedCases.map((s, i) => (
                <CaseCard 
                  key={i} 
                  {...s} 
                  onClick={() => setSelectedCaseToDonate(s)}
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
