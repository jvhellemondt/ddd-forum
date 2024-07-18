import { Hono } from "hono";
import { createUserView } from "./view";

const router = new Hono();
router.post("/new", createUserView);

export const createUserRouter = router;
