import { sql } from "drizzle-orm";
import { db } from "./connection";
import { users } from "./tables/users";

export const table = {
  users,
};

async function databaseHealthCheck(connection: typeof db) {
  console.group("Database connection");
  try {
    const result = connection.get<string[]>(sql`SELECT datetime("now") as now;`);
    console.info(`Database is up, created at ${result[0]}`);
  } catch (error) {
    console.error("Something went wrong connecting to the database");
    console.error({ error });
  }
  console.groupEnd();
}

export { db, databaseHealthCheck };
