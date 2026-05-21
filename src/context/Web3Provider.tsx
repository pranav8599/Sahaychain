"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ethers } from "ethers";
import { connectWallet as connectMetaMask } from "../../lib/connectWallet";
import { authenticateUGF, ugfClient, encodeERC20Transfer, MOCK_USD_SEPOLIA_ADDRESS } from "../../lib/ugf";

// Mock UGF Provider since we don't have a real API key/contract yet
// But we will structure it so it's easy to swap
export const UGFContext = createContext<{
  isGaslessEnabled: boolean;
  setIsGaslessEnabled: (enabled: boolean) => void;
  mockUsdBalance: number;
  setMockUsdBalance: (balance: number) => void;
  simulateTransaction: (txName: string) => Promise<{ success: boolean; hash: string }>;
  
  // Real MetaMask & UGF operations
  isWalletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<any>;
  isUgfAuthenticated: boolean;
  loginUGF: () => Promise<any>;
  executeGaslessDonation: (recipientAddress: string, amount: string | number) => Promise<{ hash: string, walletAddress: string, status: string }>;
  signer: any;
  provider: any;
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

  // Real MetaMask and UGF Auth states
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isUgfAuthenticated, setIsUgfAuthenticated] = useState(false);

  // Initialize wallet connection states from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSig = localStorage.getItem("ugf_signature");
      const savedAddr = localStorage.getItem("ugf_address");
      if (savedSig && savedAddr) {
        setWalletAddress(savedAddr);
        setIsWalletConnected(true);
        setIsUgfAuthenticated(true);
      }
    }
  }, []);

  // 1. MetaMask Connection
  const handleConnectWallet = async () => {
    try {
      const result = await connectMetaMask();
      if (result) {
        setSigner(result.signer);
        setWalletAddress(result.address);
        setProvider(result.provider);
        setIsWalletConnected(true);
        console.log("[Web3Provider] Connected wallet address:", result.address);
        return result;
      }
    } catch (error: any) {
      console.error("[Web3Provider] Wallet connection failed:", error);
      alert(`Wallet Connection Error: ${error.message || error}`);
      throw error;
    }
  };

  // 2. UGF Authentication
  const handleLoginUGF = async () => {
    let activeSigner = signer;
    let activeAddress = walletAddress;

    // Connect wallet first if not already connected
    if (!activeSigner || !activeAddress) {
      const conn = await handleConnectWallet();
      if (!conn) throw new Error("Could not connect wallet for authentication.");
      activeSigner = conn.signer;
      activeAddress = conn.address;
    }

    try {
      const result = await authenticateUGF(activeSigner, activeAddress);
      if (result.success) {
        setIsUgfAuthenticated(true);
        console.log("[Web3Provider] UGF Authenticated successfully:", result);
        return result;
      }
    } catch (error: any) {
      console.error("[Web3Provider] UGF Login signature failed:", error);
      alert(`Signature Authentication Failed: ${error.message}`);
      throw error;
    }
  };

  // 3. Gasless Donation Flow (MOST IMPORTANT)
  const executeGaslessDonation = async (recipientAddress: string, amount: string | number) => {
    let activeSigner = signer;
    let activeAddress = walletAddress;

    // Ensure wallet is connected
    if (!activeAddress) {
      const conn = await handleConnectWallet();
      if (!conn) throw new Error("Wallet not connected for donation.");
      activeSigner = conn.signer;
      activeAddress = conn.address;
    }

    // Ensure UGF is authenticated
    if (!isUgfAuthenticated) {
      await handleLoginUGF();
    }

    try {
      // 1. Encode contract call data using ethers.js
      const encodedData = encodeERC20Transfer(recipientAddress, amount);
      console.log("[Web3Provider] Encoded ERC20 Transfer Call Data:", encodedData);

      // 2. Call ugfClient.sendTransaction on Sepolia network (chainId 11155111)
      const receipt = await ugfClient.sendTransaction(
        activeAddress,
        MOCK_USD_SEPOLIA_ADDRESS, // Contract Address
        encodedData,
        11155111, // Sepolia Chain ID
        activeSigner || undefined
      );

      // Deduct balance locally for premium UI experience
      const donationAmount = Number(amount);
      if (!isNaN(donationAmount)) {
        setMockUsdBalance(prev => Math.max(0, prev - donationAmount));
      }

      return receipt;
    } catch (error: any) {
      console.error("[Web3Provider] Gasless Donation failed:", error);
      throw error;
    }
  };

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
            
            // Real MetaMask & UGF operations
            isWalletConnected,
            walletAddress,
            connectWallet: handleConnectWallet,
            isUgfAuthenticated,
            loginUGF: handleLoginUGF,
            executeGaslessDonation,
            signer,
            provider,
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
