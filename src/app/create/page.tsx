"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Upload, 
  ShieldCheck, 
  Lock, 
  Info, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MapPin
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUGF } from "@/context/Web3Provider";
import { useLanguage } from "@/context/LanguageContext";
import { cn, fetchWithRetry } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


const steps = ["Details", "Media", "Verification", "Review"];

export default function CreateCasePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Medical Emergency",
    goal: "",
    location: "",
    imageUrl: ""
  });
  const { simulateTransaction } = useUGF();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate web3/transaction security overlay first
    const result = await simulateTransaction("Secure Case Creation");
    
    if (result.success) {
      try {
        const payload = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          goal: Number(formData.goal),
          location: formData.location,
          imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800",
          creatorId: user?.id,
        };

        const res = await fetchWithRetry("/api/cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setIsSuccess(true);
        } else {
          console.error("Failed to create case");
        }
      } catch (error) {
        console.error(error);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        
        <main className="flex-grow py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {!isSuccess ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Raise Funds</h1>
                <p className="text-slate-500 dark:text-slate-400">Follow the steps to create a verified fundraising case on SahayChain.</p>
              </div>

              {/* Progress Bar */}
              <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                <motion.div 
                  className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
                {steps.map((step, i) => (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                      i <= currentStep ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400"
                    )}>
                      {i < currentStep ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                    </div>
                    <span className={cn(
                      "mt-2 text-xs font-bold uppercase tracking-wider",
                      i <= currentStep ? "text-blue-600" : "text-slate-400"
                    )}>{step}</span>
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <div className="glass-card rounded-3xl p-8 mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold mb-2">Title of the Case</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Help Sarah with her Education" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2">Beneficiary Name</label>
                            <input type="text" placeholder="Full name of person in need" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold mb-2">Category</label>
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">
                              <option value="Medical Emergency">Medical Emergency</option>
                              <option value="Scholarship">Scholarship Support</option>
                              <option value="Disaster Relief">Disaster Relief</option>
                              <option value="Blood Donate">Blood Donation Appeal</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2">Location</label>
                            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City, Country" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold mb-2">Funding Goal (INR)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                              <input type="number" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} placeholder="50000" className="w-full pl-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2">Urgency</label>
                            <select className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">
                              <option>Immediate (Critical)</option>
                              <option>Within 7 days</option>
                              <option>Standard (30+ days)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold mb-2">The Story (Description)</label>
                          <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Tell the world why this aid is important. Be as descriptive as possible to build trust..." className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-8">
                        <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl group hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-900/50">
                          <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4 group-hover:text-blue-500" />
                          <h3 className="text-lg font-bold mb-2">Upload Featured Ad Photo</h3>
                          <p className="text-slate-500 text-sm mb-6">This photo will be shown to all potential donors.</p>
                          <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Choose Image</button>
                        </div>
                        
                        <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                          <label className="block text-sm font-bold mb-4">Or provide an image link</label>
                          <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://example.com/photo.jpg" className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start space-x-3">
                          <Info className="w-5 h-5 text-amber-500 mt-0.5" />
                          <p className="text-sm text-amber-600 dark:text-amber-400">Human-to-Human transparency is our priority. Please provide verification documents and payment details.</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold mb-2">Identity Verification (Gov ID)</label>
                            <div className="flex items-center space-x-4">
                              <div className="flex-grow">
                                <input type="file" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
                              </div>
                              <Lock className="w-6 h-6 text-slate-400" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold mb-2">Payment Details / Disbursement Instruction</label>
                            <textarea rows={3} placeholder="How should the funds be transferred once raised? (e.g., Hospital Direct Pay, Personal Bank, or Crypto Wallet)" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                          <h3 className="font-bold mb-4 flex items-center">
                             <ShieldCheck className="w-5 h-5 text-blue-600 mr-2" />
                             Ad Preview (How Donors See It)
                          </h3>
                          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                             <div className="h-48 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <Upload className="w-10 h-10 text-slate-400" />
                             </div>
                             <div className="p-6">
                                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
                                  <MapPin className="w-3 h-3" />
                                  <span>{formData.location || "[Location Name]"}</span>
                                </div>
                                <h4 className="text-xl font-bold mb-2">{formData.title || "[Case Title Preview]"}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{formData.description || "The detailed story you wrote will appear here to connect with donors on a personal level."}</p>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-4"></div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-blue-600">
                                   <span>₹0 Raised</span>
                                   <span>Goal: ₹{formData.goal || "[Goal]"}</span>
                                </div>
                             </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                          <ShieldCheck className="w-6 h-6 text-green-500" />
                          <p className="text-sm font-bold text-green-600 dark:text-green-400">Ready to go live. Your ad will be visible to our community of 10,000+ donors.</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={cn(
                    "flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all",
                    currentStep === 0 ? "opacity-0 cursor-default" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-10 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <span>{currentStep === steps.length - 1 ? "Publish Case" : "Continue"}</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 glass-card rounded-3xl p-12"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Case Submitted!</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-md mx-auto">
                Your case has been successfully registered in our secure community vault. Our team will verify the details shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold">Go to Dashboard</Link>
                <Link href="/tracking" className="px-8 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">Track Status</Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}
