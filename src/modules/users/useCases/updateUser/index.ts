import { Hono } from "hono";
import { userEditView } from "./view";

const router = new Hono();
router.post("/edit/:userId", userEditView);

export const userEditRouter = router;
