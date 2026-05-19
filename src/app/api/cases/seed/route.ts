import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const mockCases = [
  {
    title: "Support for Blind School Digital Lab",
    description: "Help us build a state-of-the-art computer lab for visually impaired students at Hope Academy.",
    category: "Education",
    goal: 20000,
    location: "Bangalore, India",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Post-Earthquake Reconstruction",
    description: "Rebuilding community centers and homes for survivors of the recent tremors in the Himalayan belt.",
    category: "Disaster",
    goal: 100000,
    location: "Nepal",
    imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Clean Water Wells for 5 Villages",
    description: "Providing sustainable clean water access to over 2,000 residents in arid regions.",
    category: "Community",
    goal: 25000,
    location: "Rajasthan, India",
    imageUrl: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800"
  }
];

export async function GET() {
  try {
    const count = await prisma.case.count();
    if (count === 0) {
      // Need a default admin user to act as creator
      let admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (!admin) {
        admin = await prisma.user.create({
          data: {
            fullName: "System Admin",
            email: "admin@sahaychain.org",
            role: "ADMIN"
          }
        });
      }

      for (const c of mockCases) {
        await prisma.case.create({
          data: {
            ...c,
            creatorId: admin.id,
            isVerified: true
          }
        });
      }
      return NextResponse.json({ message: "Database seeded successfully" });
    }
    return NextResponse.json({ message: "Database already seeded" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
