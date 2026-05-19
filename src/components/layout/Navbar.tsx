"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  LayoutDashboard,
  HeartPulse,
  Users,
  GraduationCap,
  History,
  Activity,
  User,
  LogOut,
  Trophy,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();

  const publicNavItems = [
    { name: "About", href: "/#about", icon: ShieldCheck },
    { name: "Impact", href: "/#impact", icon: Activity },
    { name: "Join Us", href: "/join-us", icon: Users },
  ];

  const privateNavItems = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("nav.donate"), href: "/donate", icon: HeartPulse },
    { name: t("nav.scholarships"), href: "/scholarships", icon: GraduationCap },
    { name: t("nav.disasterRelief"), href: "/disaster-relief", icon: Users },
    { name: t("nav.tracking"), href: "/tracking", icon: Activity },
    { name: t("nav.leaderboard"), href: "/leaderboard", icon: Trophy },
    { name: t("nav.history"), href: "/history", icon: History },
  ];

  const currentNavItems = isAuthenticated ? privateNavItems : publicNavItems;

  return (
    <nav className="glass-navbar border border-white/20 dark:border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gradient">SahayChain</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 group",
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn("w-4 h-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-blue-500")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSelector />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/20">
                  <Wallet className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Web3 Secure</span>
                </div>
                
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

                <div className="flex items-center space-x-2">
                  <Link href="/profile" className="flex items-center space-x-3 p-1.5 pr-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-black">{user?.fullName.split(" ")[0]}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-5 py-2.5 text-sm font-black text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
                  {t("nav.login")}
                </Link>
                <Link href="/signup" className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                  {t("nav.signup")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageSelector />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {currentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-4 rounded-2xl text-base font-black transition-all",
                    pathname === item.href 
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" className="flex items-center space-x-4 px-4 py-4 text-base font-black text-slate-600 dark:text-slate-400">
                      <User className="w-6 h-6" />
                      <span>Profile Settings</span>
                    </Link>
                    <button onClick={logout} className="w-full flex items-center space-x-4 px-4 py-4 text-base font-black text-rose-500">
                      <LogOut className="w-6 h-6" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-black text-sm">
                      {t("nav.login")}
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20">
                      {t("nav.signup")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
