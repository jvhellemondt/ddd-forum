import { Hono } from "hono";
import { getUserView } from "./view";

const router = new Hono();
router.get("/", getUserView);

export const getUserRouter = router;
