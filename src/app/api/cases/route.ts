import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      where: {
        goal: {
          gt: 0
        }
      },
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            upiId: true,
            fullName: true,
            walletAddress: true,
          }
        }
      }
    });
    return NextResponse.json(cases);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, goal, location, imageUrl, creatorId } = body;

    if (!title || !description || !location || !creatorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const goalNumber = Number(goal);
    if (isNaN(goalNumber) || goalNumber <= 0) {
      return NextResponse.json({ error: "Funding goal must be a positive amount greater than 0" }, { status: 400 });
    }

    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        category,
        goal: goalNumber,
        location,
        imageUrl,
        creatorId, // assuming creatorId is passed (in a real app, extract from session)
      },
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
