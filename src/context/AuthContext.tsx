"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { fetchWithRetry } from "@/lib/utils";

export type UserRole = "Donor" | "Requester" | "NGO" | "Admin";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  location?: string;
  walletAddress?: string;
  upiId?: string;
  trustScore?: number;
  impactScore?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const user = session?.user ? {
    id: (session.user as any).id,
    fullName: session.user.name || "",
    email: session.user.email || "",
    role: (session.user as any).role || "USER",
    profileImage: session.user.image || "",
    trustScore: (session.user as any).trustScore || 100,
    impactScore: (session.user as any).impactScore || 0,
  } as User : null;

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        console.error("Login failed:", res.error);
        
        // If email not verified, we can handle it specifically
        if (res.error.includes("Email not verified")) {
          alert("Your email is not verified. Redirecting to verification...");
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        } else {
          alert(`Login Failed: ${res.error}`);
        }
      } else {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error(e);
      alert("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetchWithRetry("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });
      if (res.ok) {
        const responseData = await res.json();
        if (responseData.requiresOtp) {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        } else {
          router.push("/login");
        }
      } else {
        const errorData = await res.json();
        console.error("Signup failed:", errorData.error || res.statusText);
        alert(`Signup Failed: ${errorData.error || "Please check your credentials."}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Signup Failed: ${e.message || "An unexpected error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated: !!user, 
      isLoading: isLoading || status === "loading",
      isInitialized: status !== "loading"
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
