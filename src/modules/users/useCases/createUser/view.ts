import type { Context } from "hono";
import { createUserController, type CreateUserControllerErrors } from "./controller";
import type { User } from "~/shared/infrastructure/database/models/users";
import type { Maybe } from "~/shared/common/types";
import { match, Err, Result } from "oxide.ts";
import { UserErrors } from "@/users/users.errors";
import { CommonErrors } from "~/shared/common/errors";
import { ulid } from "ulid";

// Handling user input
// Displaying data

type CreateUserViewErrors = CreateUserControllerErrors | CommonErrors.ServerError | CommonErrors.UnexpectedServerError;

const buildResponse = ({ error, data }: { error?: Maybe<CreateUserViewErrors>; data?: Maybe<User> }) => ({
  error,
  data,
  success: !Boolean(error),
});

export const createUserView = async (context: Context) => {
  let createUserResult: Result<User, CreateUserViewErrors>;
  try {
    const body = await context.req.json();
    createUserResult = await createUserController({ password: ulid(), ...body });
  } catch (err) {
    createUserResult = Err(CommonErrors.ServerError);
  }

  return match(createUserResult, {
    Ok: (data: User) => {
      context.status(201);
      return context.json(buildResponse({ data }));
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
