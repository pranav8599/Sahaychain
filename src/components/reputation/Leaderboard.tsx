"use client";

import React from "react";
import { useReputation } from "@/context/ReputationContext";
import { Trophy, Medal, Crown, TrendingUp, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BadgeDisplay } from "./BadgeDisplay";
import { motion } from "framer-motion";

export function Leaderboard() {
  const { leaderboard } = useReputation();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/20"><Crown className="w-7 h-7 text-white" /></div>;
      case 1: return <div className="w-12 h-12 bg-slate-300 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-300/20"><Medal className="w-7 h-7 text-white" /></div>;
      case 2: return <div className="w-12 h-12 bg-amber-700/80 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-700/20"><Medal className="w-7 h-7 text-white" /></div>;
      default: return <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center"><span className="font-black text-slate-400 text-lg">#{index + 1}</span></div>;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center space-x-3 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
            <Trophy className="w-5 h-5" />
            <span>Community Hall of Fame</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
            Impact <span className="text-gradient">Leaderboard</span>
          </h2>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search global impact..." 
            className="pl-14 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-bold min-w-[320px] shadow-sm"
          />
        </div>
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Rank</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Impact Agent</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Score</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lives Influenced</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vault Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((user, index) => (
                <motion.tr 
                  key={user.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all group"
                >
                  <td className="px-10 py-8">
                    {getRankIcon(index)}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center font-black text-blue-600 text-xl border border-blue-600/10 group-hover:scale-110 transition-transform">
                        {user.userId.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-xl mb-1 text-slate-900 dark:text-white">Contributor {user.userId}</div>
                        <div className="flex items-center text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                          <TrendingUp className="w-3 h-3 mr-1.5" />
                          <span>Elite Trust Level</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                      {formatCurrency(user.impactScore)}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-2">
                       <span className="font-black text-lg text-slate-700 dark:text-slate-300">{user.verifiedHelpCount}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lives</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="scale-90 origin-left">
                       <BadgeDisplay badges={user.badges} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
