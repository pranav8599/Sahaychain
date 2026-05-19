import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            upiId: true,
            fullName: true,
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

    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        category,
        goal: Number(goal),
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
