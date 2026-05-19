const { Client } = require("pg");
require("dotenv").config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected. Updating schema...");
    await client.query('ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "razorpayOrderId" TEXT;');
    await client.query('ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "razorpayPaymentId" TEXT;');
    await client.query('ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "razorpaySignature" TEXT;');
    
    // Add unique constraints
    try {
      await client.query('ALTER TABLE "Donation" ADD CONSTRAINT "Donation_razorpayOrderId_key" UNIQUE ("razorpayOrderId");');
    } catch(e) { console.log(e.message) }
    
    try {
      await client.query('ALTER TABLE "Donation" ADD CONSTRAINT "Donation_razorpayPaymentId_key" UNIQUE ("razorpayPaymentId");');
    } catch(e) { console.log(e.message) }

    console.log("Database schema successfully updated.");
  } catch (err) {
    console.error("Failed to run alter queries:", err);
  } finally {
    await client.end();
  }
}

main();
