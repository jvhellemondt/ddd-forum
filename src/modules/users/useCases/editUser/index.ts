import { Hono } from "hono";
import { editUserView } from "./view";

const router = new Hono();
router.put("/edit/:userId", editUserView);

export const editUserRouter = router;
