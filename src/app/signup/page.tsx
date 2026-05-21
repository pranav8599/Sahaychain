"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Smartphone, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Upload,
  Camera,
  Heart,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    role: "Donor",
    location: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const { signup, isLoading: authLoading, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isMounted, isAuthenticated, router]);

  const isLoading = isLoadingLocal || authLoading;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(formData);
  };

  const roles = [
    { id: "Donor", label: t("auth.roles.donor"), icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: "Requester", label: t("auth.roles.requester"), icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "NGO", label: t("auth.roles.ngo"), icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
    { id: "Admin", label: t("auth.roles.admin"), icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gradient">SahayChain</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">{t("auth.signupTitle")}</h1>
          <p className="text-slate-500">Step {step} of 3 • {step === 1 ? "Choose your role" : step === 2 ? "Basic details" : "Final steps"}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between mb-12 px-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0" 
            initial={{ width: "0%" }}
            animate={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {[1, 2, 3].map((i) => (
            <div key={i} className={cn(
              "w-8 h-8 rounded-full relative z-10 flex items-center justify-center font-bold text-sm transition-colors duration-300",
              i <= step ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400"
            )}>
              {i < step ? <CheckCircle2 className="w-5 h-5" /> : i}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.id as any })}
                      className={cn(
                        "p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden group",
                        formData.role === r.id 
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10" 
                          : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-700"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", r.bg, r.color)}>
                        <r.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg">{r.label}</h3>
                      <div className={cn(
                        "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        formData.role === r.id ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-600"
                      )}>
                        {formData.role === r.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={handleNext} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20">
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">Or</span></div>
                </div>
                <button 
                  type="button" 
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full flex items-center justify-center space-x-2 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.38z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm font-bold">Sign up with Google</span>
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+91 98765 43210" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={handleBack} className="flex-grow py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold">Back</button>
                  <button type="button" onClick={handleNext} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2">
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-950 shadow-xl flex items-center justify-center overflow-hidden">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                    <button type="button" className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City, State" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{t("auth.uploadId")}</p>
                    <p className="text-[10px] text-slate-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={handleBack} className="flex-grow py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold">Back</button>
                  <button type="submit" onClick={handleSubmit} disabled={isLoading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">
                    {isLoading ? "Creating..." : t("auth.signUp")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-10 text-slate-500 font-medium">
          {t("auth.alreadyMember")}{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">{t("auth.signIn")}</Link>
        </p>
      </div>
    </div>
  );
}
