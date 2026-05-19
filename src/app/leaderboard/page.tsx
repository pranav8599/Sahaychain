"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Leaderboard } from "@/components/reputation/Leaderboard";
import { Trophy, Award, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function LeaderboardPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-12 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mt-64" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-amber-500/20"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Community Excellence</span>
            </motion.div>
            <h1 className="text-5xl font-black tracking-tight mb-6">Impact <span className="text-gradient">Leaderboard</span></h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
              Celebrating our top contributors who are making the world a better place through SahayChain.
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Total Helpers", value: "1,240", icon: Users, color: "text-blue-500" },
              { label: "Impact Score", value: "48,250", icon: TrendingUp, color: "text-green-500" },
              { label: "Badges Awarded", value: "356", icon: Award, color: "text-violet-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center space-x-5"
              >
                <div className={cn("w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-2xl font-black">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <Leaderboard />
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">How is the rank calculated?</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
              Your rank is determined by your total contributions, verified impact, and positive feedback from beneficiaries. Join the top 1% by helping more people today.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { cn } from "@/lib/utils";
