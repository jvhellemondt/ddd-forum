import { Hono } from "hono";
import { healthRouter } from "@/common/useCases/getHealth";
import { usersRouter } from "@/users";

const app = new Hono();

app.route("/", healthRouter);
app.route("/", usersRouter);

export default app;
