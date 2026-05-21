"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { fetchWithRetry } from "@/lib/utils";

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
  refreshCertificates: () => Promise<void>;
}

const CertificateContext = createContext<CertificateContextType | null>(null);

export function CertificateProvider({ children }: { children: React.ReactNode }) {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const { user } = useAuth();

  const refreshCertificates = React.useCallback(async () => {
    if (!user?.id) {
      setCertificates([]);
      return;
    }

    try {
      const res = await fetchWithRetry(`/api/donations?userId=${user.id}`);
      if (res.ok) {
        const donations = await res.json();
        const dbCertificates: CertificateData[] = donations.map((d: any) => ({
          id: d.certificate?.id || `CERT-${d.id}`,
          donorId: d.userId || "",
          donorName: d.user?.fullName || "Anonymous Donor",
          donorWallet: d.walletAddress || d.user?.walletAddress || "",
          beneficiaryName: d.case?.title || "Unknown Cause",
          beneficiaryId: d.caseId,
          amount: d.amount,
          date: d.createdAt,
          txHash: d.txHash || d.razorpayPaymentId || `TX-${d.id}`,
        }));
        setCertificates(dbCertificates);
        
        // Backwards compatibility with any legacy local items
        try {
          localStorage.setItem("sahaychain_certificates", JSON.stringify(dbCertificates));
        } catch (storageErr) {
          console.warn("Could not save to localStorage:", storageErr);
        }
      }
    } catch (e) {
      console.error("Failed to load certificates from database:", e);
    }
  }, [user?.id]);

  useEffect(() => {
    // Initial load from local storage as placeholder/quick-render
    try {
      const saved = localStorage.getItem("sahaychain_certificates");
      if (saved) {
        setCertificates(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load certificates from local storage", e);
    }
  }, []);

  // Fetch certificates from the database as soon as user ID is available or changes
  useEffect(() => {
    if (user?.id) {
      refreshCertificates();
    } else {
      setCertificates([]);
    }
  }, [user?.id, refreshCertificates]);

  const generateCertificate = (data: Omit<CertificateData, "id" | "date">) => {
    const newCert: CertificateData = {
      ...data,
      id: "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
    };

    const updated = [newCert, ...certificates];
    setCertificates(updated);
    try {
      localStorage.setItem("sahaychain_certificates", JSON.stringify(updated));
    } catch (storageErr) {
      console.warn("Could not save to localStorage:", storageErr);
    }
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
        refreshCertificates,
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

