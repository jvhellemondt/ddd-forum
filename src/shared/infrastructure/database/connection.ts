import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database(":memory:", { strict: true });

export const db = drizzle(sqlite);
