import type { Context } from "hono";
import { db, table } from "~/shared/infrastructure/database";

export const usersListView = (context: Context) => {
	const users = db.select().from(table.users).all();
	context.status(200);
	return context.json({ items: users || [] });
};
