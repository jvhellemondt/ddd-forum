import { Hono } from "hono";

const app = new Hono();

app.get("/health", (context) => {
  context.status(200);
  return context.text("OK");
});

export default app;
