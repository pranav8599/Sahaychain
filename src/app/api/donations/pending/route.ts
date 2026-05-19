import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requesterId = searchParams.get("requesterId");

    if (!requesterId) {
      return NextResponse.json({ error: "Requester ID required" }, { status: 400 });
    }

    const pendingDonations = await prisma.donation.findMany({
      where: {
        case: {
          creatorId: requesterId,
        },
        status: "PENDING",
      },
      include: {
        case: {
          select: { title: true },
        },
        user: {
          select: { fullName: true },
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pendingDonations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
