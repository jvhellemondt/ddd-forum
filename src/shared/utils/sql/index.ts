import { sql } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const lower = (value: SQLiteColumn) => {
	return sql`lower(${value})`;
};
