"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { fetchWithRetry } from "@/lib/utils";

function OTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputs = useRef<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    if (!email) {
      alert("No email provided for verification.");
      return;
    }
    
    setIsVerifying(true);
    const otpString = otp.join("");
    
    try {
      const res = await fetchWithRetry("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });
      
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorData = await res.json();
        alert(`Verification Failed: ${errorData.error}`);
      }
    } catch (e: any) {
      alert("An unexpected error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md text-center"
    >
      <div className="mb-10">
        <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Verify your email</h1>
        <p className="text-slate-500">We've sent a 6-digit code to {email || "your email"}. Enter it below to verify your account.</p>
      </div>

      <div className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
        {!isSuccess ? (
          <div className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              ))}
            </div>

            <div className="text-sm text-slate-500">
              Didn't receive the code? <button type="button" className="text-blue-600 font-bold hover:underline">Resend code</button>
            </div>

            <button
              onClick={handleVerify}
              disabled={otp.some(d => !d) || isVerifying || !email}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="py-6"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verified Successfully!</h2>
            <p className="text-slate-500">You will be redirected to the login page.</p>
          </motion.div>
        )}
      </div>

      {!isSuccess && (
        <Link href="/signup" className="flex items-center justify-center space-x-2 mt-8 text-slate-500 font-bold hover:text-blue-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Signup</span>
        </Link>
      )}
    </motion.div>
  );
}

export default function OTPPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>}>
        <OTPForm />
      </Suspense>
    </div>
  );
}
