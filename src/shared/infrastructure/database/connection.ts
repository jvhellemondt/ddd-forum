import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database(":memory:", { strict: true });

export const db = drizzle(sqlite);

export type Database = typeof db;
