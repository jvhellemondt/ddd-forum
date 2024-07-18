import { UserErrors } from "@/users/users.errors";
import type { Context } from "hono";
import { Err, type Result, match } from "oxide.ts";
import { CommonErrors } from "~/shared/common/errors";
import type { Maybe } from "~/shared/common/types";
import type { User } from "~/shared/infrastructure/database/models/users";
import { type EditUserControllerErrors, editUserController } from "./controller";
import { pick } from "lodash-es";

// Handling user input
// Displaying data

type EditUserViewErrors = EditUserControllerErrors | CommonErrors.ServerError | CommonErrors.UnexpectedServerError;

const buildResponse = ({ error, data }: { error?: Maybe<EditUserViewErrors>; data?: Maybe<Partial<User>> }) => ({
  error,
  data,
  success: !error,
});

export const editUserView = async (context: Context) => {
  let createUserResult: Result<User, EditUserViewErrors>;
  try {
    createUserResult = await editUserController(context);
  } catch (err) {
    createUserResult = Err(CommonErrors.ServerError);
  }

  return match(createUserResult, {
    Ok: (data: User) => {
      context.status(201);
      const user = pick(data, ["id", "email", "username", "firstName", "lastName"]);
      return context.json(buildResponse({ data: user }));
    },
    Err: [
      [
        CommonErrors.ValidationError,
        (err) => {
          context.status(400);
          return context.json(buildResponse({ error: err }));
        },
      ],
      [
        UserErrors.UserNotFound,
        (err) => {
          context.status(404);
          return context.json(buildResponse({ error: err }));
        },
      ],
      [
        UserErrors.UsernameAlreadyTaken,
        (err) => {
          context.status(409);
          return context.json(buildResponse({ error: err }));
        },
      ],
      [
        UserErrors.EmailAlreadyInUse,
        (err) => {
          context.status(409);
          return context.json(buildResponse({ error: err }));
        },
      ],
      [
        CommonErrors.ServerError,
        (err) => {
          context.status(500);
          return context.json(buildResponse({ error: err }));
        },
      ],
    ],
    _: () => {
      context.status(500);
      return context.json(buildResponse({ error: CommonErrors.UnexpectedServerError }));
    },
  });
};
