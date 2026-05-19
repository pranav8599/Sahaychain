"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Download, Printer } from "lucide-react";
import { CertificateData } from "@/context/CertificateContext";
import { Certificate } from "./Certificate";

interface CertificateModalProps {
  data: CertificateData;
  onClose: () => void;
}

export function CertificateModal({ data, onClose }: CertificateModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:block">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm print:hidden"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-transparent print:max-w-none print:w-full print:h-auto print:block"
      >
        {/* Actions Bar - Hidden on print */}
        <div className="flex justify-between items-center mb-4 print:hidden">
          <div className="text-white font-bold text-sm tracking-widest uppercase">
            Tax Document Verified
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all backdrop-blur-md border border-white/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="overflow-y-auto no-scrollbar rounded-sm print:overflow-visible flex-grow shadow-2xl">
           <Certificate data={data} />
        </div>
      </motion.div>
    </div>
  );
}
