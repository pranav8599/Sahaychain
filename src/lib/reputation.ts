export type BadgeType = "Helper" | "Lifesaver" | "Supporter" | "Champion" | "Legacy";

export interface Review {
  id: string;
  donorId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  rating: number; // 1 to 5
  feedback: string;
  timestamp: string;
  caseTitle: string;
}

export interface UserReputation {
  userId: string;
  impactScore: number;
  trustScore: number; // 0 to 100
  verifiedHelpCount: number;
  totalDonated: number;
  rank: number;
  badges: BadgeType[];
  reviews: Review[];
}

export const BADGE_CONFIG = {
  Helper: {
    label: "Helper",
    description: "Successfully helped at least 5 people.",
    color: "bg-blue-500",
    icon: "Heart"
  },
  Lifesaver: {
    label: "Lifesaver",
    description: "Donated over $5,000 for critical medical cases.",
    color: "bg-rose-500",
    icon: "Shield"
  },
  Supporter: {
    label: "Supporter",
    description: "Consistently donated for 3 months or more.",
    color: "bg-amber-500",
    icon: "Award"
  },
  Champion: {
    label: "Champion",
    description: "Ranked in the top 10 contributors of the month.",
    color: "bg-emerald-500",
    icon: "Trophy"
  },
  Legacy: {
    label: "Legacy Donor",
    description: "Recognized for consistent repeat contributions over time.",
    color: "bg-indigo-500",
    icon: "Shield"
  }
};

export function calculateTrustScore(reviews: Review[], verifiedHelpCount: number): number {
  if (reviews.length === 0) return verifiedHelpCount > 0 ? 70 : 50;
  
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingScore = (avgRating / 5) * 80; // Max 80 points from ratings
  const helpScore = Math.min(verifiedHelpCount * 2, 20); // Max 20 points from volume
  
  return Math.min(Math.round(ratingScore + helpScore), 100);
}

export function getEarnedBadges(reputation: Partial<UserReputation>): BadgeType[] {
  const badges: BadgeType[] = [];
  
  if ((reputation.verifiedHelpCount || 0) >= 5) badges.push("Helper");
  if ((reputation.totalDonated || 0) >= 5000) badges.push("Lifesaver");
  if ((reputation.totalDonated || 0) >= 1000) badges.push("Supporter");
  if ((reputation.rank || 100) <= 10) badges.push("Champion");
  if ((reputation.verifiedHelpCount || 0) >= 10) badges.push("Legacy");
  
  return badges;
}
