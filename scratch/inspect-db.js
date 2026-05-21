const { Client } = require("pg");
require("dotenv").config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // List all tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log("Tables:");
    console.log(tablesRes.rows.map(r => r.table_name));

    // List columns for User table
    const columnsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User';
    `);
    console.log("\nUser Columns:");
    console.table(columnsRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
