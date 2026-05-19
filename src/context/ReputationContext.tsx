"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Review, UserReputation, calculateTrustScore, getEarnedBadges, BadgeType } from "@/lib/reputation";
import { useAuth } from "./AuthContext";

interface ReputationContextType {
  reputation: UserReputation | null;
  submitReview: (review: Omit<Review, "id" | "timestamp">) => Promise<void>;
  getDonorReputation: (donorId: string) => UserReputation | null;
  allReviews: Review[];
  leaderboard: UserReputation[];
}

const ReputationContext = createContext<ReputationContextType | null>(null);

export function ReputationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [reputations, setReputations] = useState<Record<string, UserReputation>>({});

  useEffect(() => {
    const initReputation = () => {
      try {
        const savedReviews = localStorage.getItem("sahaychain_reviews");
        const savedReputations = localStorage.getItem("sahaychain_reputations");
        
        if (savedReviews) setAllReviews(JSON.parse(savedReviews));
        if (savedReputations) setReputations(JSON.parse(savedReputations));
        else {
          const mockInitial: Record<string, UserReputation> = {
            "u1": {
              userId: "u1",
              impactScore: 1450,
              trustScore: 98,
              verifiedHelpCount: 24,
              totalDonated: 1450,
              rank: 12,
              badges: ["Helper", "Supporter"],
              reviews: [
                {
                  id: "r1",
                  donorId: "u1",
                  beneficiaryId: "b1",
                  beneficiaryName: "Aman Gupta",
                  rating: 5,
                  feedback: "Thank you so much for the help! The surgery was successful.",
                  timestamp: new Date().toISOString(),
                  caseTitle: "Emergency Surgery for Rahul"
                }
              ]
            }
          };
          setReputations(mockInitial);
          localStorage.setItem("sahaychain_reputations", JSON.stringify(mockInitial));
        }
      } catch (e) {
        console.error("Reputation initialization failed:", e);
      }
    };
    initReputation();
  }, []);

  const submitReview = async (reviewData: Omit<Review, "id" | "timestamp">) => {
    const newReview: Review = {
      ...reviewData,
      id: "rev_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...allReviews];
    setAllReviews(updatedReviews);
    localStorage.setItem("sahaychain_reviews", JSON.stringify(updatedReviews));

    // Update donor reputation
    const donorId = reviewData.donorId;
    const currentRep = reputations[donorId] || {
      userId: donorId,
      impactScore: 0,
      trustScore: 50,
      verifiedHelpCount: 0,
      totalDonated: 0,
      rank: 100,
      badges: [],
      reviews: []
    };

    const updatedDonorReviews = [newReview, ...currentRep.reviews];
    const newVerifiedCount = currentRep.verifiedHelpCount + 1;
    const newTrustScore = calculateTrustScore(updatedDonorReviews, newVerifiedCount);
    
    const updatedRep: UserReputation = {
      ...currentRep,
      verifiedHelpCount: newVerifiedCount,
      reviews: updatedDonorReviews,
      trustScore: newTrustScore,
      badges: getEarnedBadges({ ...currentRep, verifiedHelpCount: newVerifiedCount, trustScore: newTrustScore })
    };

    const newReputations = { ...reputations, [donorId]: updatedRep };
    setReputations(newReputations);
    localStorage.setItem("sahaychain_reputations", JSON.stringify(newReputations));
  };

  const getDonorReputation = (donorId: string) => {
    return reputations[donorId] || null;
  };

  const leaderboard = Object.values(reputations).sort((a, b) => b.impactScore - a.impactScore);

  return (
    <ReputationContext.Provider value={{ 
      reputation: user ? reputations[user.id] : null, 
      submitReview, 
      getDonorReputation,
      allReviews,
      leaderboard
    }}>
      {children}
    </ReputationContext.Provider>
  );
}

export const useReputation = () => {
  const context = useContext(ReputationContext);
  if (!context) throw new Error("useReputation must be used within ReputationProvider");
  return context;
};
