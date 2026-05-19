"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SahayChain</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">{isSent ? "Check your email" : t("auth.forgotPassword")}</h1>
          <p className="text-slate-500">
            {isSent 
              ? `We've sent a password reset link to ${email}`
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 ml-1">{t("auth.email")}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-500 mb-8">Didn't receive the email? Check your spam folder or try again.</p>
              <button 
                onClick={() => setIsSent(false)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold"
              >
                Resend Email
              </button>
            </div>
          )}
        </div>

        <Link href="/login" className="flex items-center justify-center space-x-2 mt-8 text-slate-500 font-bold hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </motion.div>
    </div>
  );
}
