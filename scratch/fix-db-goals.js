const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ 
  connectionString,
  connectionTimeoutMillis: 15000,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database cleanup for cases with zero or invalid goals...");

  // 1. Find all cases with goal <= 0 or empty title
  const invalidCases = await prisma.case.findMany({
    where: {
      OR: [
        { goal: { lte: 0 } },
        { title: "" }
      ]
    }
  });

  console.log(`Found ${invalidCases.length} cases with invalid goals or empty titles.`);

  for (const c of invalidCases) {
    let updatedTitle = c.title;
    let updatedDescription = c.description;
    let updatedLocation = c.location;
    let updatedGoal = c.goal;

    if (!c.title || c.title.trim() === "") {
      if (c.id === "92eacba0-f3d2-4bc8-bae9-cb2fbbc528b6") {
        updatedTitle = "Emergency Cardiac Surgery Support";
        updatedDescription = "Immediate financial assistance needed for critical open heart surgery. Your generous donation will help save a life.";
        updatedLocation = "Mumbai, India";
      } else {
        updatedTitle = "Community Welfare Support Fund";
        updatedDescription = "Assisting low-income families and community projects in times of urgent need.";
        updatedLocation = "India";
      }
    }

    if (c.goal <= 0) {
      if (c.id === "92eacba0-f3d2-4bc8-bae9-cb2fbbc528b6") {
        updatedGoal = 150000; // ₹1,50,000
      } else if (c.id === "29f99b9e-1b2e-4547-8e73-d54bbf596114") {
        updatedGoal = 50000;  // ₹50,000
      } else if (c.id === "bdb42a48-bcd0-43bf-a27a-07c645df14d4") {
        updatedGoal = 100000; // ₹1,00,000
      } else {
        updatedGoal = 25000;  // ₹25,000
      }
    }

    if (!c.description || c.description.trim() === "") {
      updatedDescription = "Emergency financial support to cover medical expenses and surgical procedures for underprivileged individuals.";
    }

    if (!c.location || c.location.trim() === "") {
      updatedLocation = "Maharashtra, India";
    }

    console.log(`Updating Case ID: ${c.id}`);
    console.log(`- New Title: "${updatedTitle}"`);
    console.log(`- New Goal: ₹${updatedGoal}`);
    console.log(`- New Location: "${updatedLocation}"`);

    await prisma.case.update({
      where: { id: c.id },
      data: {
        title: updatedTitle,
        description: updatedDescription,
        location: updatedLocation,
        goal: updatedGoal
      }
    });
  }

  console.log("Database cleanup completed successfully.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
