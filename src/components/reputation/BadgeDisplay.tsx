"use client";

import React from "react";
import { BadgeType, BADGE_CONFIG } from "@/lib/reputation";
import { Heart, Shield, Award, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  Heart,
  Shield,
  Award,
  Trophy
};

export function BadgeDisplay({ badges, className }: { badges: BadgeType[], className?: string }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badgeType) => {
        const config = BADGE_CONFIG[badgeType];
        const Icon = ICON_MAP[config.icon];
        
        return (
          <div
            key={badgeType}
            className="group relative"
          >
            <div className={cn(
              "p-2 rounded-xl text-white shadow-lg transition-transform hover:scale-110",
              config.color
            )}>
              <Icon className="w-4 h-4" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl">
              <p className="font-bold mb-1">{config.label}</p>
              <p className="text-slate-400 leading-tight">{config.description}</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
