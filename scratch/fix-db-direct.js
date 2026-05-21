const { Client } = require("pg");
require("dotenv").config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting directly to Neon database...");
    await client.connect();
    console.log("Connected successfully. Updating cases with 0 goal...");

    // 1. Update Case 1
    const res1 = await client.query(`
      UPDATE "Case" 
      SET 
        title = 'Emergency Cardiac Surgery Support', 
        description = 'Immediate financial assistance needed for critical open heart surgery. Your generous donation will help save a life.', 
        location = 'Maharashtra, India', 
        goal = 150000 
      WHERE id = '92eacba0-f3d2-4bc8-bae9-cb2fbbc528b6' AND (goal <= 0 OR title = '');
    `);
    console.log(`Updated Case 92eacba0: ${res1.rowCount} row(s) updated.`);

    // 2. Update Case 2
    const res2 = await client.query(`
      UPDATE "Case" 
      SET 
        title = 'Emergency Surgery Support',
        description = 'Help support an urgent medical surgery for a patient from an underprivileged community.',
        location = 'Maharashtra, India',
        goal = 50000 
      WHERE id = '29f99b9e-1b2e-4547-8e73-d54bbf596114' AND (goal <= 0 OR title = '');
    `);
    console.log(`Updated Case 29f99b9e: ${res2.rowCount} row(s) updated.`);

    // 3. Update Case 3
    const res3 = await client.query(`
      UPDATE "Case" 
      SET 
        title = 'Medical Fund for Pediatric Surgery',
        description = 'Supporting a pediatric surgery for a young boy diagnosed with a critical condition.',
        location = 'Maharashtra, India',
        goal = 100000 
      WHERE id = 'bdb42a48-bcd0-43bf-a27a-07c645df14d4' AND (goal <= 0 OR title = '');
    `);
    console.log(`Updated Case bdb42a48: ${res3.rowCount} row(s) updated.`);

    // 4. Update any other general cases with goal <= 0
    const resGeneral = await client.query(`
      UPDATE "Case"
      SET goal = 50000
      WHERE goal <= 0;
    `);
    console.log(`Updated general zero-goal cases: ${resGeneral.rowCount} row(s) updated.`);

    console.log("Database cleanup completed successfully!");
  } catch (err) {
    console.error("Direct connection update failed:", err);
  } finally {
    await client.end();
  }
}

main();
