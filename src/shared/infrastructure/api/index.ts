import { healthRouter } from "@/common/useCases/getHealth";
import { usersRouter } from "@/users";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";

const app = new Hono();

app.use("/*", cors(), etag(), requestId(), logger());
app.route("/", healthRouter);
app.route("/", usersRouter);

export default app;
