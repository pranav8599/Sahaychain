const { Client } = require("pg");
require("dotenv").config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database. Running migration queries...");

    // 1. Alter User table
    console.log("Altering 'User' table...");
    await client.query(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP WITH TIME ZONE;
    `);
    await client.query(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
    `);

    // 2. Create Account table
    console.log("Creating 'Account' table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
        CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
      );
    `);

    // 3. Create Session table
    console.log("Creating 'Session' table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT PRIMARY KEY,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP WITH TIME ZONE NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
    `);

    // 4. Create VerificationToken table
    console.log("Creating 'VerificationToken' table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT UNIQUE NOT NULL,
        "expires" TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
      );
    `);

    console.log("Database migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

main();
