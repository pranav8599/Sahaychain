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

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP in the database, valid for 10 minutes
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // In a real application, send the OTP via email here.
    // For this hackathon/demo, we print it to the server console:
    console.log(`\n\n=========================================`);
    console.log(`🚀 NEW USER SIGNUP OTP: ${otp}`);
    console.log(`📧 EMAIL: ${email}`);
    console.log(`=========================================\n\n`);

    // Exclude passwordHash from response
    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json({ ...safeUser, requiresOtp: true }, { status: 201 });
  } catch (error: any) {
    // Handle unique constraint violations (e.g. email or wallet exists)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "User with this email or wallet already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
