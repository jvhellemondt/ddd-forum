import { Hono } from "hono";
import { createUserRouter } from "./useCases/createUser";
import { editUserRouter } from "./useCases/editUser";
import { getUserRouter } from "./useCases/getUser";

const router = new Hono().basePath("users");
router.route("/", createUserRouter);
router.route("/", editUserRouter);
router.route("/", getUserRouter);

export const usersRouter = router;
