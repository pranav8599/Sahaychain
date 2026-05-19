"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Users, 
  Zap, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface CaseCardProps {
  title: string;
  description: string;
  category: string;
  raised: number;
  goal: number;
  donors: number;
  timeLeft: string;
  isVerified?: boolean;
  isGasless?: boolean;
  image?: string;
  location?: string;
  href?: string;
  onClick?: () => void;
}

import Link from "next/link";


export function CaseCard({
  title,
  description,
  category,
  raised,
  goal,
  donors,
  timeLeft,
  isVerified = true,
  isGasless = true,
  image = "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800",
  location = "Global",
  href,
  onClick,
}: CaseCardProps) {
  const progress = Math.min((raised / goal) * 100, 100);

  const cardContent = (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col h-full group cursor-pointer border border-white/10"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="px-4 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
            {category}
          </span>
          {isGasless && (
            <span className="px-4 py-1.5 rounded-2xl bg-green-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest flex items-center border border-white/20">
              <ShieldCheck className="w-3 h-3 mr-1.5" />
              Verified
            </span>
          )}
        </div>
        
        {isVerified && (
          <div className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        )}

        <div className="absolute bottom-5 left-5 flex items-center text-white/90 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
          {location}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-black mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">
          {description}
        </p>

        <div className="mt-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Raised</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline">
                {formatCurrency(raised)}
                <span className="text-xs font-bold text-slate-400 ml-2">/ {formatCurrency(goal)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-blue-600">
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Donor" className="w-full h-full object-cover" />
                 </div>
               ))}
               <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                 +{donors}
               </div>
            </div>
            <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
               <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
               {timeLeft}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (onClick) {
    return <div onClick={onClick} className="block h-full">{cardContent}</div>;
  }

  return href ? <Link href={href} className="block h-full">{cardContent}</Link> : <div onClick={onClick} className="block h-full">{cardContent}</div>;
}

