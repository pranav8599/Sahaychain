"use client";

import React, { useRef } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { ShieldCheck, QrCode, Award, CheckCircle2 } from "lucide-react";
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
    <div className="relative w-full aspect-[1.414/1] bg-white text-slate-900 shadow-2xl rounded-sm overflow-hidden p-8 md:p-12 font-sans border-8 border-slate-100 flex flex-col justify-between print:shadow-none print:border-none print:p-0">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600 rounded-full blur-[100px]" />
      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 border-t-[40px] border-r-[40px] border-blue-600/10 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 border-b-[40px] border-l-[40px] border-blue-600/10 rounded-bl-3xl" />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-blue-900">SahayChain</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Impact Network</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Certificate ID</p>
          <p className="font-mono text-sm font-semibold text-slate-700">{data.id}</p>
        </div>
      </div>

      {/* Body */}
      <div className="text-center relative z-10 flex-grow flex flex-col justify-center my-8">
        <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
           <Award className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 font-serif tracking-tight">Certificate of Donation</h1>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10">Tax Benefit Applicable (Section 80G Eligible)</p>
        
        <p className="text-lg md:text-xl text-slate-600 mb-4 font-medium italic">This is to proudly certify that</p>
        <h2 className="text-3xl md:text-4xl font-black text-blue-700 mb-4 border-b-2 border-slate-200 inline-block px-8 pb-2">
          {data.donorName}
        </h2>
        
        <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm mb-10">
           <span>Wallet Ref:</span>
           <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{data.donorWallet || "Verified Account"}</span>
        </div>

        <p className="text-lg md:text-xl text-slate-600 font-medium">
          has generously contributed <span className="font-black text-2xl text-slate-900 mx-2">{formatCurrency(data.amount)}</span> 
          towards the verified cause
        </p>
        <p className="text-xl md:text-2xl font-bold text-slate-800 mt-4 mb-2">{data.beneficiaryName}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end relative z-10 border-t border-slate-200 pt-8 mt-4">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Issuance</p>
            <p className="font-bold text-slate-800">{formattedDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Blockchain Tx Hash</p>
            <p className="font-mono text-xs text-slate-600 w-48 truncate" title={data.txHash}>{data.txHash}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center mb-2 overflow-hidden p-1">
            <QRCodeSVG value={`https://sahaychain.app/verify/${data.id}`} size={64} className="text-slate-800" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan to Verify</p>
        </div>
      </div>
      
      {/* Official Stamp */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none rotate-[-15deg]">
        <div className="w-40 h-40 border-4 border-blue-600 rounded-full flex items-center justify-center">
          <div className="w-36 h-36 border border-blue-600 rounded-full flex items-center justify-center p-4 text-center text-blue-600 font-bold uppercase tracking-widest text-sm">
            SahayChain<br/>Verified<br/>Impact
          </div>
        </div>
      </div>
    </div>
  );
}
