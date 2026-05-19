import React from "react";
import Link from "next/link";
import { ShieldCheck, Send, Globe, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Footer() {
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gradient">SahayChain</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              A trusted social impact platform dedicated to transparent fund distribution and verified humanitarian aid.
            </p>
          </div>
          
          {isAuthenticated ? (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/donate" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Emergency Aid</Link></li>
                <li><Link href="/scholarships" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Scholarships</Link></li>
                <li><Link href="/disaster-relief" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Disaster Relief</Link></li>
                <li><Link href="/tracking" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Live Tracker</Link></li>
              </ul>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">SahayChain</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Donor Login</Link></li>
                <li><Link href="/signup" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Join the Mission</Link></li>
                <li><Link href="/join-us" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Partner with Us</Link></li>
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">How it Works</Link></li>
              {isAuthenticated && (
                <li><Link href="/admin" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Verification Portal</Link></li>
              )}
              <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Transparency Report</Link></li>
              <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 text-sm">Governance</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Send className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Award className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            © 2026 SahayChain. Empowering communities through trusted aid.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-slate-500 dark:text-slate-400 text-xs hover:text-blue-600">Privacy Policy</Link>
            <Link href="#" className="text-slate-500 dark:text-slate-400 text-xs hover:text-blue-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
