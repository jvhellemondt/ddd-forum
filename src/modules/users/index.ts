import { Hono } from "hono";
import { userCreateRouter } from "./useCases/createUser";
import { getUserRouter } from "./useCases/getUser";
import { userEditRouter } from "./useCases/updateUser";

const router = new Hono().basePath("users");
router.route("/", userCreateRouter);
router.route("/", userEditRouter);
router.route("/", getUserRouter);

export const usersRouter = router;
