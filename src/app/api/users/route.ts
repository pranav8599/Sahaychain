import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, walletAddress, role } = body;

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        walletAddress,
        role: role || "USER",
      },
    });

    // Exclude passwordHash from response
    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    // Handle unique constraint violations (e.g. email or wallet exists)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "User with this email or wallet already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
