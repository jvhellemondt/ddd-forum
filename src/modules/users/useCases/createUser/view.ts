import type { Context } from "hono";
import { ulid } from "ulid";

export const userCreateView = (context: Context) => {
	context.status(201);
	return context.json({ id: ulid() });
};
