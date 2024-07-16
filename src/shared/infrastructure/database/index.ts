import { sql } from "drizzle-orm";
import { db } from "./connection";
import type { Database } from "./connection";
import { users, createUserTable, seedUserTable } from "./users";

export const table = {
  users,
};

async function databaseHealthCheck(connection: Database) {
  console.group("Database connection");
  try {
    const result = connection.get<Record<string, string>>(sql`select datetime('now') as now;`);
    console.info(`Database is up, created at ${result.now}`);
  } catch (error) {
    console.error("Something went wrong connecting to the database");
    console.error({ error });
  }
  console.groupEnd();
}

export { db, databaseHealthCheck };

export default [databaseHealthCheck, createUserTable, seedUserTable].forEach((fn) => fn(db));
