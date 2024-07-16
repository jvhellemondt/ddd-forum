import SqliteDatabase from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new SqliteDatabase(":memory:", { strict: true });
export const db = drizzle(sqlite);

export type Database = typeof db;
