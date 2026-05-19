import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donationId, requesterId } = body;

    // 1. Fetch the donation and associated case to ensure the requester owns it
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        case: true,
      },
    });

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    if (donation.case.creatorId !== requesterId) {
      return NextResponse.json({ error: "Unauthorized: You do not own this case." }, { status: 403 });
    }

    if (donation.status === "VERIFIED") {
      return NextResponse.json({ error: "Donation is already verified." }, { status: 400 });
    }

    // 2. Perform verification transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Update donation status
      const updatedDonation = await tx.donation.update({
        where: { id: donationId },
        data: { status: "VERIFIED" },
      });

      // Update Case raised amount
      await tx.case.update({
        where: { id: donation.caseId },
        data: {
          raised: {
            increment: donation.amount,
          },
        },
      });

      let certificate = null;

      // If a user (donor) made this donation, give them a certificate and update trust scores
      if (donation.userId) {
        certificate = await tx.certificate.create({
          data: {
            userId: donation.userId,
            generatedUrl: `https://sahaychain.org/verify/${donation.id}`, // Mock URL
          },
        });

        await tx.donation.update({
          where: { id: donation.id },
          data: { certificateId: certificate.id },
        });

        await tx.user.update({
          where: { id: donation.userId },
          data: {
            impactScore: { increment: donation.amount },
            trustScore: { increment: 10 },
          },
        });
      }

      return { donation: updatedDonation, certificate };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
