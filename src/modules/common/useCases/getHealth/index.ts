import { Hono } from "hono";

const router = new Hono();

router.get("/health", (context) => {
	context.status(200);
	return context.text("OK");
});

export const healthRouter = router;
