import { Hono } from "hono";
import { userCreateView } from "./view";

const router = new Hono();
router.post("/new", userCreateView);

export const userCreateRouter = router;
