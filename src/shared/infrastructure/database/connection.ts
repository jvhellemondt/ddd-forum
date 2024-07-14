import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database(":memory:", { strict: true });

export const db = drizzle(sqlite);
