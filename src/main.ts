import "./shared/infrastructure/database";
import { Hono } from "hono";
import { healthRouter } from "./modules/common/useCases/getHealth";
import { usersRouter } from "./modules/users";

const app = new Hono();

app.route("/", healthRouter);
app.route("/", usersRouter);

export default app;
