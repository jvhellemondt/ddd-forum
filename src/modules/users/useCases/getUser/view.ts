// Handling user input
// Displaying data

import { UserErrors } from "@/users/users.errors";
import type { Context } from "hono";
import { Err, type Result, match } from "oxide.ts";
import { CommonErrors } from "~/shared/common/errors";
import type { Maybe } from "~/shared/common/types";
import type { User } from "~/shared/infrastructure/database/models/users";
import { type GetUserControllerErrors, getUserController } from "./controller";
import { pick } from "lodash-es";

type GetUserViewErrors =
  | GetUserControllerErrors
  | CommonErrors.ClientError
  | CommonErrors.ServerError
  | CommonErrors.UnexpectedServerError;

const buildResponse = ({ error, data }: { error?: Maybe<GetUserViewErrors>; data?: Maybe<Partial<User>> }) => ({
  error,
  data,
  success: !error,
});

export const getUserView = async (context: Context) => {
  let getUserResult: Result<User, GetUserViewErrors>;
  try {
    getUserResult = await getUserController(context.req.query());
  } catch (err) {
    getUserResult = Err(CommonErrors.ServerError);
  }

  return match(getUserResult, {
    Ok: (data: User) => {
      context.status(200);
      const user = pick(data, ["id", "email", "username", "firstName", "lastName"]);
      return context.json(buildResponse({ data: user }));
    },
    Err: [
      [
        CommonErrors.ClientError,
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
