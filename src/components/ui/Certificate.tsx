"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, Award, HeartHandshake, BookmarkCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { CertificateData } from "@/context/CertificateContext";

interface CertificateProps {
  data: CertificateData;
}

export function Certificate({ data }: CertificateProps) {
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative w-full aspect-[1.414/1] bg-gradient-to-br from-[#FCFCFA] via-white to-[#F7F5EE] text-slate-900 shadow-2xl rounded-sm overflow-hidden p-10 md:p-14 font-sans border-[16px] border-slate-950 flex flex-col justify-between print:shadow-none print:border-none print:p-0">
      
      {/* 1. Guilloche Security Paper Texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23000' stroke-width='1'%3E%3Cpath d='M40 0 C60 20, 60 60, 40 80 C20 60, 20 20, 40 0 Z'/%3E%3Cpath d='M0 40 C20 60, 60 60, 80 40 C60 20, 20 20, 0 40 Z'/%3E%3C/g%3E%3C/svg%3E")` 
        }} 
      />

      {/* 2. Classical Double Gold Inlay Border Frame */}
      <div className="absolute inset-3 border-[3px] border-double border-amber-600/40 pointer-events-none" />
      <div className="absolute inset-5 border border-amber-600/10 pointer-events-none" />

      {/* 3. Gold Corner Decorative Accents */}
      <div className="absolute top-9 left-9 w-12 h-12 border-t-[5px] border-l-[5px] border-amber-600/60 pointer-events-none" />
      <div className="absolute top-9 right-9 w-12 h-12 border-t-[5px] border-r-[5px] border-amber-600/60 pointer-events-none" />
      <div className="absolute bottom-9 left-9 w-12 h-12 border-b-[5px] border-l-[5px] border-amber-600/60 pointer-events-none" />
      <div className="absolute bottom-9 right-9 w-12 h-12 border-b-[5px] border-r-[5px] border-amber-600/60 pointer-events-none" />

      {/* 4. Giant Elegant Watermark Handshake Vector */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
        <HeartHandshake className="w-[30rem] h-[30rem] text-amber-950" />
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-start relative z-10 w-full">
        <div className="text-left bg-white/40 backdrop-blur-sm p-2 rounded-lg border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Certificate ID</p>
          <p className="font-mono text-xs font-bold text-slate-800">{data.id}</p>
        </div>
        
        <div className="text-right bg-white/40 backdrop-blur-sm p-2 rounded-lg border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date of Issuance</p>
          <p className="font-serif text-xs font-bold text-slate-800">{formattedDate}</p>
        </div>
      </div>

      {/* Body Content */}
      <div className="text-center relative z-10 flex-grow flex flex-col justify-center my-4">
        
        {/* State Medal Emblem */}
        <div className="mx-auto w-24 h-24 relative mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-amber-600/20" />
          <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-amber-600/30" />
          <div className="absolute inset-3 rounded-full bg-slate-950 flex items-center justify-center shadow-2xl border border-amber-600/50">
            <HeartHandshake className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        {/* Dynamic Titles */}
        <h1 className="text-xs font-black text-amber-700 tracking-[0.35em] uppercase mb-1 font-sans">
          SahayChain Verified Impact Network
        </h1>
        <h2 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight mb-2">
          Certificate of Social Impact
        </h2>
        
        <div className="flex items-center justify-center space-x-3 text-slate-400 mb-8">
          <span className="h-px w-10 bg-amber-600/40" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">80G Tax Exemption Certified • Web3 Secure</span>
          <span className="h-px w-10 bg-amber-600/40" />
        </div>

        {/* Certification Text */}
        <p className="text-slate-500 font-serif italic text-base md:text-lg mb-3">
          This official document is solemnly presented to
        </p>
        
        <h3 className="text-3xl md:text-4xl font-serif font-black text-blue-900 tracking-tight pb-3 mb-2 border-b-2 border-amber-600/10 inline-block px-14">
          {data.donorName}
        </h3>

        {/* Detailed Financial & Campaign Breakdown */}
        <p className="max-w-2xl mx-auto text-slate-700 text-sm md:text-base leading-relaxed mt-4 font-medium">
          For their generous and verified contribution of <span className="font-extrabold text-slate-950 text-lg md:text-xl">{formatCurrency(data.amount)}</span> 
          towards the social relief campaign <span className="font-extrabold text-slate-950 font-serif block mt-1 text-lg">{data.beneficiaryName}</span>
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs mt-4">
           <span className="font-black uppercase tracking-wider text-[9px] text-slate-400">Account Reference:</span>
           <span className="font-mono bg-slate-100 dark:bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold border border-slate-200">{data.donorWallet || "Verified Donor Account"}</span>
        </div>
      </div>

      {/* Signatures and Seals Row */}
      <div className="grid grid-cols-3 gap-6 items-end relative z-10 border-t border-slate-200/80 pt-6 mt-2">
        
        {/* Left Signature Block */}
        <div className="flex flex-col items-center">
          <div className="h-12 flex items-center justify-center relative w-32 mb-1">
            <svg className="w-full h-full text-blue-800/85" viewBox="0 0 120 40" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10,25 C32,6 45,34 68,12 C78,2 88,25 112,18 M38,15 L78,15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="w-32 border-t border-slate-300 my-1" />
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SahayChain Auditor</p>
          <p className="text-[8px] text-slate-500 font-bold uppercase">Official Signatory</p>
        </div>

        {/* Center Official Ribbon Medal Seal */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-18 h-18 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-xl border border-amber-600/40 relative flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-dashed border-white/60 flex flex-col items-center justify-center text-white">
              <BookmarkCheck className="w-7 h-7 drop-shadow-md" />
              <span className="text-[5px] font-black uppercase tracking-wider scale-90">TAX EXEMPT</span>
            </div>
            {/* Medallion Ribbons */}
            <div className="absolute -bottom-4 left-3.5 w-3.5 h-8 bg-rose-600 transform rotate-12 -z-10 shadow" />
            <div className="absolute -bottom-4 right-3.5 w-3.5 h-8 bg-rose-600 transform -rotate-12 -z-10 shadow" />
          </div>
        </div>

        {/* Right Scan QR Block */}
        <div className="flex flex-col items-center">
          <div className="p-1 bg-slate-50 border-2 border-amber-600/30 rounded-xl shadow-inner mb-1.5">
            <QRCodeSVG value={`https://sahaychain.app/verify/${data.id}`} size={64} className="text-slate-800" />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Scan to Verify</p>
          <p className="font-mono text-[7px] text-slate-400 font-bold tracking-tighter truncate w-32 text-center" title={data.txHash}>
            Tx: {data.txHash}
          </p>
        </div>
      </div>
      
    </div>
  );
}
