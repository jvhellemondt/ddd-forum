import { sql } from "drizzle-orm";
import { db } from "./connection";
import type { Database } from "./connection";
import { createUserTable, seedUserTable, users } from "./users";

export const table = {
  users,
};

async function databaseHealthCheck(connection: Database) {
  console.group("Database connection");
  try {
    const result = connection.get<string[]>(sql`select datetime('now');`);
    console.info(`Database is up, created at ${result[0]}`);
  } catch (error) {
    console.error("Something went wrong connecting to the database");
    console.error({ error });
  }
  console.groupEnd();
}

export { db };

export const makeDatabaseConnection = () => {
  databaseHealthCheck(db);
  createUserTable(db);
  seedUserTable(db);
};
