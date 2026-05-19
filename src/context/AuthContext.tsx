"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem("sahaychain_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetchWithRetry("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem("sahaychain_user", JSON.stringify(userData));
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        console.error("Login failed:", errorData.error || res.statusText);
        alert(`Login Failed: ${errorData.error || "Please check your credentials"}`);
      }
    } catch (e) {
      console.error(e);
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
        // Redirect to login page instead of auto-logging in
        alert("Account created successfully! Please log in with your new credentials.");
        router.push("/login");
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sahaychain_user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated: !!user, 
      isLoading,
      isInitialized 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
