"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/lib/translations";
import { Globe, Search, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { language, setLanguage, currentLanguageName } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredLanguages = languages.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
      >
        <Globe className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-bold hidden sm:inline">{currentLanguageName}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search language..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto py-2 custom-scrollbar">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as any);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left",
                      language === l.code && "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{l.nativeName}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{l.name}</span>
                    </div>
                    {language === l.code && <Check className="w-4 h-4" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-slate-500 text-sm">No languages found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
