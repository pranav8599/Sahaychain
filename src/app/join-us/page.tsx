"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Building2, 
  Handshake, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Heart,
  Globe,
  Mail,
  User,
  MapPin
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

type JoinRole = "Volunteer" | "NGO" | "Partner" | "Contributor";

export default function JoinUsPage() {
  const [activeRole, setActiveRole] = useState<JoinRole>("Volunteer");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: "Volunteer", title: "Volunteer", icon: User, desc: "Offer your skills and time to support community projects." },
    { id: "NGO", title: "NGO Partner", icon: Building2, desc: "Apply for verification to start raising funds for your cause." },
    { id: "Partner", title: "Corporate Partner", icon: Handshake, desc: "CSR partnerships for large-scale social impact." },
    { id: "Contributor", title: "Major Contributor", icon: Heart, desc: "Join our elite circle of philanthropists and donors." },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 pt-12 pb-24 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-500/20"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Join the Movement</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">Let's build a better <br /><span className="text-gradient">world together.</span></h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
              Whether you're an individual with a passion for change or an organization looking to scale your impact, there's a place for you in SahayChain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Role Selection Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">Select Your Path</h3>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role.id as JoinRole);
                    setIsSubmitted(false);
                  }}
                  className={cn(
                    "w-full p-6 rounded-[2rem] text-left transition-all flex items-center space-x-5 border group",
                    activeRole === role.id 
                      ? "bg-white dark:bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10" 
                      : "bg-slate-100/50 dark:bg-slate-900/30 border-transparent hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-800"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    activeRole === role.id ? "bg-blue-600 text-white shadow-lg" : "bg-slate-200 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600"
                  )}>
                    <role.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className={cn("font-bold text-lg", activeRole === role.id ? "text-slate-900 dark:text-white" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300")}>{role.title}</div>
                    <div className="text-xs text-slate-400 font-medium line-clamp-1">{role.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Form Area */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key={activeRole}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl"
                  >
                    <div className="flex items-center space-x-3 mb-10">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-black">{activeRole} Registration</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" required placeholder="John Doe" className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="email" required placeholder="john@example.com" className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" required placeholder="Mumbai, India" className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{activeRole === "NGO" ? "Organization Type" : "Area of Interest"}</label>
                        <select className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none font-bold text-slate-600 dark:text-slate-300">
                          <option>Health & Medical</option>
                          <option>Education & Literacy</option>
                          <option>Disaster Relief</option>
                          <option>Environmental Protection</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tell us more about your mission</label>
                        <textarea required placeholder="How can you help SahayChain's community?" className="w-full h-32 px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium"></textarea>
                      </div>
                      <div className="md:col-span-2 pt-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center space-x-3"
                        >
                          {isLoading ? (
                            <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Submit Application</span>
                              <ArrowRight className="w-6 h-6" />
                            </>
                          )}
                        </button>
                        <p className="text-center mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">SahayChain multi-stage verification will follow</p>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-[3rem] p-12 md:p-20 border border-slate-200 dark:border-slate-800 shadow-2xl text-center"
                  >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/20">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-4xl font-black mb-6">Application Received!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-md mx-auto mb-12">
                      Thank you for your interest in joining the SahayChain community. Our team will review your application and get back to you within 48 hours.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="px-12 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl"
                    >
                      Apply for Another Role
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
