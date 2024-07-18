import { sql } from "drizzle-orm";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const lower = (value: SQLiteColumn) => {
  return sql`lower(${value})`;
};
