import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Request accounts using the recommended v6 send API
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return { signer, address, provider };
  } catch (error: any) {
    console.error("MetaMask connection error:", error);
    throw error;
  }
}