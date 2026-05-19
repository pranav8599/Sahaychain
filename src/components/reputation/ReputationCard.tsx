"use client";

import React from "react";
import { ShieldCheck, TrendingUp, Users, Award } from "lucide-react";
import { BadgeDisplay } from "./BadgeDisplay";
import { UserReputation } from "@/lib/reputation";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export function ReputationCard({ reputation }: { reputation: UserReputation | null }) {
  if (!reputation) {
    return (
      <div className="glass-card p-10 rounded-[3rem] text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
           <ShieldCheck className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-black mb-3">Build Your Legacy</h3>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">Start contributing to the community to unlock your secure trust score and achievements.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-10 rounded-[3rem] relative overflow-hidden group border border-white/5"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-600/20 transition-all duration-500" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-2xl font-black flex items-center">
            <ShieldCheck className="w-7 h-7 mr-3 text-blue-600" />
            Impact Identity
          </h3>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Verified Community Member</p>
        </div>
        <div className="px-5 py-2 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">
          Rank #{reputation.rank}
        </div>
      </div>

      <div className="space-y-10 relative z-10">
        {/* Trust Meter */}
        <div>
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            <span>Trust Integrity</span>
            <span className="text-blue-600">{reputation.trustScore}% Verified</span>
          </div>
          <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-1 border border-slate-200 dark:border-slate-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${reputation.trustScore}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all group/stat">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-500 group-hover/stat:scale-125 transition-transform" />
              <span>Net Impact</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white leading-none">
               {formatCurrency(reputation.impactScore).split('.')[0]}
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all group/stat">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              <Users className="w-4 h-4 text-blue-500 group-hover/stat:scale-125 transition-transform" />
              <span>Direct Aid</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white leading-none">
               {reputation.verifiedHelpCount}
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Achievement Vault</span>
          </div>
          <BadgeDisplay badges={reputation.badges} />
        </div>
      </div>
    </motion.div>
  );
}
