"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Globe, 
  CheckCircle2,
  TrendingUp,
  Award,
  Lock,
  Search,
  Activity,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Star, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";



export default function LandingPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  const stats = [
    { label: t("stats.raised"), value: "₹10Cr+", icon: TrendingUp, color: "text-blue-500" },
    { label: t("stats.lives"), value: "45k+", icon: Users, color: "text-violet-500" },
    { label: t("stats.verified"), value: "850+", icon: ShieldCheck, color: "text-green-500" },
    { label: t("stats.trusted"), value: "24/7", icon: Activity, color: "text-rose-500" },
  ];

  const features = [
    {
      title: t("common.secureTransactions"),
      description: "Every donation is protected with military-grade encryption and secure fund distribution.",
      icon: Lock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      size: "col-span-1 md:col-span-2"
    },
    {
      title: t("common.verified"),
      description: "Rigorous multi-stage verification process.",
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
      size: "col-span-1"
    },
    {
      title: t("common.transparent"),
      description: "Real-time fund tracking ensures complete visibility.",
      icon: Search,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      size: "col-span-1"
    },
    {
      title: "Global Reach",
      description: "Connecting hearts across borders with ease.",
      icon: Globe,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      size: "col-span-1 md:col-span-2"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen mesh-gradient">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center px-6 py-2 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-10 border border-blue-500/20 shadow-xl backdrop-blur-sm uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 mr-2 fill-current" />
                The Future of Humanitarian Aid
              </span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-10 leading-[0.9] md:leading-[0.9]">
                {t("hero.title").split(". ")[0]}<br />
                <span className="text-gradient">{t("hero.title").split(". ")[1]}</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                {t("hero.subtitle")}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/donate"
                      className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center hover:-translate-y-1"
                    >
                      {t("hero.startDonating")} <ArrowRight className="ml-3 w-6 h-6" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="w-full sm:w-auto px-12 py-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-[2rem] font-black text-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg hover:-translate-y-1"
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center hover:-translate-y-1"
                    >
                      Sign Up Free
                    </Link>
                    <Link
                      href="/login"
                      className="w-full sm:w-auto px-12 py-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-[2rem] font-black text-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg hover:-translate-y-1"
                    >
                      Log In <ArrowRight className="ml-3 w-6 h-6" />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Animated Background Shapes */}
          <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px] animate-pulse delay-1000" />
        </section>

        {/* Stats Grid */}
        <section className="py-20 relative z-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-10 rounded-[2.5rem] group hover:scale-[1.02] transition-transform"
                >
                  <div className={cn("w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-5xl font-black mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Features */}
        <section id="about" className="py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-4 block">Engineered for Transparency</span>
              <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-8">Redefining <span className="text-gradient">Trust.</span></h2>
              <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto italic">"Technology at the service of humanity."</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "glass-card p-12 rounded-[3rem] group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative",
                    feature.size
                  )}
                >
                  <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3", feature.bg, feature.color)}>
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black mb-6 leading-tight">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
                    {feature.description}
                  </p>
                  
                  {/* Decorative background element */}
                  <div className={cn("absolute -bottom-10 -right-10 w-40 h-40 opacity-5 group-hover:opacity-10 transition-opacity", feature.color)}>
                    <feature.icon className="w-full h-full" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* High-Impact CTA */}
        <section className="py-40 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[5rem] overflow-hidden bg-slate-950 p-16 md:p-32 text-center border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              {/* Background gradient effects */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full -mr-80 -mt-80 blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full -ml-80 -mb-80 blur-[120px]" />
              
              <div className="relative z-10">
                <h2 className="text-5xl md:text-8xl font-black text-white mb-12 leading-[0.85] tracking-tighter">
                  Start Your <br /> 
                  <span className="text-blue-500">Impact Journey</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-16 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl hover:bg-blue-700 transition-all shadow-2xl hover:scale-105"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/#impact"
                    className="w-full sm:w-auto px-16 py-7 bg-white/5 text-white border border-white/10 rounded-[2.5rem] font-black text-2xl hover:bg-white/10 transition-all backdrop-blur-xl"
                  >
                    View Metrics
                  </Link>
                </div>
                <p className="mt-12 text-slate-500 font-black uppercase tracking-[0.3em] text-xs">
                  Trusted by 50,000+ donors worldwide
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
