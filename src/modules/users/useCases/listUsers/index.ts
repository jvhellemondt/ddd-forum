import { Hono } from "hono";
import { usersListView } from "./view";

const router = new Hono();
router.get("/", usersListView);

export const usersListRouter = router;
