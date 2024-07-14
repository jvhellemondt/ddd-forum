import { Hono } from "hono";
import { userCreateRouter } from "./useCases/createUser";
import { userEditRouter } from "./useCases/updateUser";
import { usersListRouter } from "./useCases/listUsers";

const router = new Hono().basePath("users");
router.route("/", userCreateRouter);
router.route("/", userEditRouter);
router.route("/", usersListRouter);

export const usersRouter = router;
