"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CertificateData {
  id: string;
  donorId: string;
  donorName: string;
  donorWallet?: string;
  beneficiaryName: string;
  beneficiaryId?: string;
  amount: number;
  date: string;
  txHash: string;
}

interface CertificateContextType {
  certificates: CertificateData[];
  generateCertificate: (data: Omit<CertificateData, "id" | "date">) => CertificateData;
  getUserCertificates: (userId: string) => CertificateData[];
  getCertificateById: (id: string) => CertificateData | undefined;
}

const CertificateContext = createContext<CertificateContextType | null>(null);

export function CertificateProvider({ children }: { children: React.ReactNode }) {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sahaychain_certificates");
      if (saved) {
        setCertificates(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load certificates", e);
    }
  }, []);

  const generateCertificate = (data: Omit<CertificateData, "id" | "date">) => {
    const newCert: CertificateData = {
      ...data,
      id: "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
    };

    const updated = [newCert, ...certificates];
    setCertificates(updated);
    localStorage.setItem("sahaychain_certificates", JSON.stringify(updated));
    return newCert;
  };

  const getUserCertificates = (userId: string) => {
    return certificates.filter((c) => c.donorId === userId);
  };

  const getCertificateById = (id: string) => {
    return certificates.find((c) => c.id === id);
  };

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        generateCertificate,
        getUserCertificates,
        getCertificateById,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificate must be used within a CertificateProvider");
  }
  return context;
};
