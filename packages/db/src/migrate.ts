import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "path";

async function runMigrate() {
  console.log("Running migrations...");
  
  const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/secform";
  
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    await migrate(db, { 
      migrationsFolder: path.join(__dirname, "../migrations") 
    });
    console.log("Migrations successfully completed!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

runMigrate();
