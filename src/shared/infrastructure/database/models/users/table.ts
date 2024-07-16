import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Database } from "~/shared/infrastructure/database/connection";

const createUsersTableQuery = sql`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    password TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
`;

export const createUserTable = (connection: Database) => {
	connection.run(createUsersTableQuery);
	console.info("Users table has been created");
};

export const users = sqliteTable("users", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
	username: text("username").notNull().unique(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	password: text("password").notNull(),
	createdAt: integer("createdAt", { mode: "number" }).$defaultFn(() =>
		Math.floor(new Date().getTime() / 1000),
	),
	updateAt: integer("updatedAt", { mode: "number" }).$onUpdate(() =>
		Math.floor(new Date().getTime() / 1000),
	),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
