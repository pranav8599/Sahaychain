"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock UGF Provider since we don't have a real API key/contract yet
// But we will structure it so it's easy to swap
export const UGFContext = createContext<{
  isGaslessEnabled: boolean;
  setIsGaslessEnabled: (enabled: boolean) => void;
  mockUsdBalance: number;
  setMockUsdBalance: (balance: number) => void;
  simulateTransaction: (txName: string) => Promise<{ success: boolean; hash: string }>;
} | null>(null);

const queryClient = new QueryClient();

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isGaslessEnabled, setIsGaslessEnabled] = useState(true);
  const [mockUsdBalance, setMockUsdBalance] = useState(500.0);

  const simulateTransaction = async (txName: string) => {
    // Simulate a gasless transaction
    console.log(`Simulating UGF transaction: ${txName}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      hash: "0x" + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
    };
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UGFContext.Provider
          value={{
            isGaslessEnabled,
            setIsGaslessEnabled,
            mockUsdBalance,
            setMockUsdBalance,
            simulateTransaction,
          }}
        >
          {children}
        </UGFContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const useUGF = () => {
  const context = useContext(UGFContext);
  if (!context) throw new Error("useUGF must be used within Web3Provider");
  return context;
};
