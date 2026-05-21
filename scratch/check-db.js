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
  log: ["query"],
});

async function main() {
  const cases = await prisma.case.findMany({
    include: {
      creator: true
    }
  });
  console.log("Cases in database:");
  console.log(JSON.stringify(cases, null, 2));
  
  const users = await prisma.user.findMany();
  console.log("\nUsers in database:");
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
