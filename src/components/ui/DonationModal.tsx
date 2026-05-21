"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, CheckCircle2 } from "lucide-react";
import { useUGF } from "@/context/Web3Provider";
import { useAuth } from "@/context/AuthContext";
import { useCertificate, CertificateData } from "@/context/CertificateContext";
import { CertificateModal } from "@/components/ui/CertificateModal";
import { cn, formatCurrency, fetchWithRetry } from "@/lib/utils";
import Script from "next/script";

interface DonationModalProps {
  selectedCase: any;
  onClose: () => void;
}

export function DonationModal({ selectedCase, onClose }: DonationModalProps) {
  const [donationAmount, setDonationAmount] = useState("");
  const [isDonating, setIsDonating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<CertificateData | null>(null);
  
  // Tab control and Receipt state
  const [paymentMethod, setPaymentMethod] = useState<"gasless" | "fiat">("gasless");
  const [receipt, setReceipt] = useState<{ hash: string; walletAddress: string; status: string } | null>(null);

  const { 
    isWalletConnected, 
    walletAddress, 
    connectWallet, 
    isUgfAuthenticated, 
    loginUGF, 
    executeGaslessDonation,
    mockUsdBalance 
  } = useUGF();
  const { user } = useAuth();
  const { refreshCertificates } = useCertificate();

  const handleConnect = async () => {
    try {
      setIsDonating(true);
      await connectWallet();
    } catch (err: any) {
      alert(err.message || "Failed to connect MetaMask");
    } finally {
      setIsDonating(false);
    }
  };

  const handleSignAuth = async () => {
    try {
      setIsDonating(true);
      await loginUGF();
    } catch (err: any) {
      alert(err.message || "Failed to sign login message");
    } finally {
      setIsDonating(false);
    }
  };

  const handleGaslessDonationSubmit = async () => {
    if (!donationAmount || isNaN(Number(donationAmount))) return;
    setIsDonating(true);

    try {
      // Execute the gasless token transfer via UGF SDK (on Sepolia network)
      const txReceipt = await executeGaslessDonation(
        selectedCase.creator?.walletAddress || selectedCase.creatorWalletAddress || "0x6E17C2F9F6eE8cC9d404F32371D7981504fe084e", // beneficiary target
        donationAmount
      );

      setReceipt(txReceipt);

      // Call backend to record the transaction and generate the certificate in the database
      const saveRes = await fetchWithRetry("/api/donations/gasless", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donationAmount,
          txHash: txReceipt.hash,
          walletAddress: txReceipt.walletAddress,
          chainId: 11155111, // Standard Sepolia for this SDK demo or Base Sepolia
          caseId: selectedCase.id,
          userId: user?.id,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error(saveData.error || "Failed to record donation in database");
      }

      // Generate verifiable certificate
      const certData: CertificateData = {
        id: saveData.certificateId || "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        donorId: user?.id || "anon",
        donorName: user?.fullName || "Anonymous Hero",
        amount: Number(donationAmount),
        beneficiaryName: selectedCase.title,
        date: new Date().toLocaleDateString(),
        txHash: txReceipt.hash,
      };

      setCurrentCertificate(certData);
      setIsSuccess(true);
      refreshCertificates().catch((err) => console.error("Failed to refresh certificates:", err));
    } catch (err: any) {
      console.error(err);
      alert("Donation Failed: " + (err.message || err));
    } finally {
      setIsDonating(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!donationAmount || isNaN(Number(donationAmount))) return;
    setIsDonating(true);

    try {
      // 1. Create order
      const orderRes = await fetchWithRetry("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donationAmount,
          caseId: selectedCase.id,
          userId: user?.id,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";

      // 2. Initialize Razorpay Checkout
      const options = {
        key: keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "SahayChain Foundation",
        description: `Donation for ${selectedCase.title}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetchWithRetry("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: donationAmount,
              caseId: selectedCase.id,
              userId: user?.id,
              walletAddress: user?.walletAddress || walletAddress,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            // Receipt representation for fiat
            setReceipt({
              hash: verifyData.txHash || `fiat_${Date.now()}`,
              walletAddress: walletAddress || "0xAnonymous",
              status: "success",
            });

            // Generate Certificate
            const certData: CertificateData = {
              id: verifyData.certificateId || "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              donorId: user?.id || "anon",
              donorName: user?.fullName || "Anonymous Hero",
              amount: Number(donationAmount),
              beneficiaryName: selectedCase.title,
              date: new Date().toLocaleDateString(),
              txHash: verifyData.txHash,
            };
            
            setCurrentCertificate(certData);
            setIsSuccess(true);
            refreshCertificates().catch((err) => console.error("Failed to refresh certificates:", err));
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      if (keyId === "rzp_test_placeholder") {
        // Mock payment flow for demo
        setTimeout(() => {
          options.handler({
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_order_id: orderData.order.id,
            razorpay_signature: "mock_signature",
          });
        }, 1500);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          alert("Payment Failed: " + response.error.description);
        });
        rzp.open();
      }
    } catch (e: any) {
      console.error(e);
      alert("Error: " + e.message);
    } finally {
      setIsDonating(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setDonationAmount("");
    setCurrentCertificate(null);
    setReceipt(null);
    onClose();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-xl glass-card rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 my-auto z-10"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:rotate-90 z-20"
          >
            <X className="w-6 h-6" />
          </button>
          
          {!isSuccess ? (
            <div className="p-6 sm:p-12 md:p-16">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Impact Contribution</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Secure Transaction Protocol</p>
                </div>
              </div>

              {/* Payment Method Selector Tab */}
              <div className="flex border border-slate-200 dark:border-slate-800 mb-8 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("gasless")}
                  className={cn(
                    "flex-1 py-3 text-center rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                    paymentMethod === "gasless"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  ⚡ Gasless Web3
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("fiat")}
                  className={cn(
                    "flex-1 py-3 text-center rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                    paymentMethod === "fiat"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  💳 Card / UPI
                </button>
              </div>

              <div className="mb-10 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                <img src={selectedCase.image || selectedCase.imageUrl || "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800"} className="w-20 h-20 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-black text-xl mb-1">{selectedCase.title}</h3>
                  <div className="flex items-center text-sm font-bold text-blue-600">
                    Goal: {formatCurrency(selectedCase.goal)}
                    <span className="mx-2 opacity-30">|</span>
                    {selectedCase.category}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Select Contribution Level</label>
                  <div className="relative mb-6">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₹</span>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-12 pr-6 py-6 rounded-[2rem] bg-slate-100 dark:bg-slate-900/50 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 outline-none text-4xl font-black transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {["500", "1000", "2000", "5000"].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDonationAmount(amt)}
                        className={cn(
                          "py-4 rounded-2xl border-2 font-black text-sm transition-all",
                          donationAmount === amt
                            ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20"
                            : "border-slate-100 dark:border-slate-800 hover:border-blue-600/30 text-slate-500"
                        )}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === "gasless" ? (
                  <div className="p-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-600/10 space-y-6">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                      <span>Mock USD Wallet Balance</span>
                      <span className="text-blue-600 font-extrabold">₹{mockUsdBalance}</span>
                    </div>

                    <div className="space-y-3">
                      {/* Step 1: Wallet Connection */}
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                            isWalletConnected ? "bg-emerald-500 text-white" : "bg-blue-600/10 text-blue-600"
                          )}>
                            1
                          </span>
                          <span className="text-sm font-bold">Connect MetaMask</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                          {isWalletConnected ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}` : "Disconnected"}
                        </span>
                      </div>

                      {/* Step 2: Signature Authentication */}
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                            isUgfAuthenticated ? "bg-emerald-500 text-white" : "bg-blue-600/10 text-blue-600"
                          )}>
                            2
                          </span>
                          <span className="text-sm font-bold">Sign Security Auth</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                          {isUgfAuthenticated ? "Authorized" : "Awaiting Sign"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-600/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-400">Network Gas Fee (UGF)</span>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Sponsored</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-blue-600/10">
                      <span className="text-lg font-black">Total Commitment</span>
                      <span className="text-3xl font-black text-blue-600">₹{donationAmount || "0"}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                      * Certificate generated immediately after secure payment.
                    </p>
                  </div>
                )}

                {paymentMethod === "gasless" ? (
                  !isWalletConnected ? (
                    <button
                      type="button"
                      onClick={handleConnect}
                      disabled={isDonating}
                      className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-4 hover:-translate-y-1 active:translate-y-0"
                    >
                      {isDonating ? <span>Connecting...</span> : <span>1. Connect MetaMask Wallet</span>}
                    </button>
                  ) : !isUgfAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleSignAuth}
                      disabled={isDonating}
                      className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-4 hover:-translate-y-1 active:translate-y-0"
                    >
                      {isDonating ? <span>Signing...</span> : <span>2. Sign Security Auth Message</span>}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGaslessDonationSubmit}
                      disabled={!donationAmount || isDonating}
                      className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-4 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                    >
                      {isDonating ? <span>Processing Gasless Tx...</span> : <span>Donate Gaslessly (Mock USD)</span>}
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={handleRazorpayPayment}
                    disabled={!donationAmount || isDonating}
                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-4 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
                  >
                    {isDonating ? <span>Processing...</span> : <span>Proceed to Secure Payment</span>}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-12 md:p-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)]"
              >
                <CheckCircle2 className="w-14 h-14 text-white" />
              </motion.div>
              <h2 className="text-5xl font-black mb-6 tracking-tight">Payment Successful!</h2>
              <p className="text-slate-500 text-lg font-medium mb-8 leading-relaxed">
                Your secure contribution of <span className="text-blue-600 font-black">₹{donationAmount}</span> was successful.
                An on-chain transaction via UGF has been recorded and your certificate is ready.
              </p>

              {/* Receipt System Display */}
              {receipt && (
                <div className="p-6 mb-8 text-left bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span className="font-bold">Protocol Status:</span>
                    <span className="text-emerald-500 uppercase font-black">{receipt.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Payer Address:</span>
                    <span className="truncate max-w-[180px]" title={receipt.walletAddress}>{receipt.walletAddress}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold mb-1">Transaction Hash:</span>
                    <span className="text-[10px] break-all text-blue-600 dark:text-blue-400">{receipt.hash}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Show Certificate Modal over the Donation Modal */}
        <AnimatePresence>
          {currentCertificate && (
            <CertificateModal
              data={currentCertificate}
              onClose={() => setCurrentCertificate(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
