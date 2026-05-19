import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Provider";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ReputationProvider } from "@/context/ReputationContext";
import { CertificateProvider } from "@/context/CertificateContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SahayChain | Transparent Social Impact",
  description: "A decentralized platform for emergency medical cases, scholarships, and disaster relief with secure, transparent fund flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}>
        <AuthProvider>
          <ReputationProvider>
            <LanguageProvider>
              <Web3Provider>
                <CertificateProvider>
                  {children}
                </CertificateProvider>
              </Web3Provider>
            </LanguageProvider>
          </ReputationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
