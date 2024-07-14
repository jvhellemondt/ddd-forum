import type { Context } from "hono";

export const userEditView = (context: Context) => {
	const userId = context.req.param("userId");
	context.status(200);
	return context.json({ id: userId });
};
