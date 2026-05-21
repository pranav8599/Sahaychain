import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface GaslessRequestBody {
  amount: number | string;
  txHash: string;
  walletAddress: string;
  chainId: number;
  caseId: string;
  userId?: string;
}

export async function POST(request: Request) {
  try {
    const body: GaslessRequestBody = await request.json();
    const { amount, txHash, walletAddress, chainId, caseId, userId } = body;

    if (!amount || !txHash || !walletAddress || !caseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure case exists in DB (creates placeholder for mock cases to satisfy foreign keys)
    let dbCase = await prisma.case.findUnique({
      where: { id: caseId }
    });

    if (!dbCase) {
      dbCase = await prisma.case.create({
        data: {
          id: caseId,
          title: caseId.toLowerCase().includes("disaster") || caseId.toLowerCase().includes("relief") || caseId.toLowerCase().includes("emergency")
            ? (caseId === "mock-disaster-1" ? "Cyclone Relief 2026" : "Wildfire Suppression Fund")
            : (caseId === "mock-1" ? "STEM Excellence Scholarship" : "Rural Arts Grant 2026"),
          description: caseId.toLowerCase().includes("disaster") || caseId.toLowerCase().includes("relief") || caseId.toLowerCase().includes("emergency")
            ? "Emergency shelter and medical supplies for global emergencies and humanitarian aid."
            : "Supporting academic success, tuition, and artistic mentorship.",
          category: caseId.toLowerCase().includes("disaster") || caseId.toLowerCase().includes("relief") || caseId.toLowerCase().includes("emergency")
            ? "Disaster"
            : "Scholarship",
          goal: 50000,
          raised: 0,
          creatorId: userId || "placeholder-creator-id", // Use donor's user id or placeholder
          imageUrl: caseId.toLowerCase().includes("disaster") || caseId.toLowerCase().includes("relief") || caseId.toLowerCase().includes("emergency")
            ? "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800"
            : "https://images.unsplash.com/photo-152305085306e-8c3d3e7d4f1a?auto=format&fit=crop&q=80&w=800",
          isVerified: true
        }
      });
    }

    // Use a transaction to perform database operations atomically
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Record Donation in DB
      const donation = await tx.donation.create({
        data: {
          amount: Number(amount),
          status: "SUCCESS",
          txHash,
          walletAddress,
          chainId: Number(chainId),
          caseId,
          userId: userId || null,
        },
      });

      // 2. Update Case Raised Amount
      await tx.case.update({
        where: { id: caseId },
        data: { raised: { increment: Number(amount) } },
      });

      let certificate = null;

      // 3. Generate Certificate Record if user is logged in
      if (userId) {
        certificate = await tx.certificate.create({
          data: {
            userId: userId,
            generatedUrl: `https://sahaychain.org/verify/${donation.id}`,
          },
        });

        // 4. Connect Certificate to Donation
        await tx.donation.update({
          where: { id: donation.id },
          data: { certificateId: certificate.id }
        });

        // 5. Update User trust scores and impact scores
        await tx.user.update({
          where: { id: userId },
          data: {
            impactScore: { increment: Number(amount) },
            trustScore: { increment: 10 },
          },
        });
      }

      return { donation, certificateId: certificate?.id || null };
    });

    return NextResponse.json(
      {
        success: true,
        donation: result.donation,
        certificateId: result.certificateId,
        txHash
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Gasless Donation Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
