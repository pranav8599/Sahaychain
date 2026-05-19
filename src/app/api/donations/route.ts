import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, txHash, utr, screenshotUrl, walletAddress, chainId, caseId, userId } = body;

    // 1. Create the pending donation record
    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        utr,
        screenshotUrl,
        status: "PENDING",
        txHash: txHash || null, // Optional for web3 fallback
        walletAddress: walletAddress || null,
        chainId: chainId ? Number(chainId) : null,
        caseId,
        userId: userId || null, // Optional if anonymous
      },
    });

    return NextResponse.json({ donation, message: "Donation is pending verification." }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
