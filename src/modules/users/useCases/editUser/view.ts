import { UserErrors } from "@/users/users.errors";
import type { Context } from "hono";
import { Err, type Result, match } from "oxide.ts";
import { CommonErrors } from "~/shared/common/errors";
import type { Maybe } from "~/shared/common/types";
import type { User } from "~/shared/infrastructure/database/models/users";
import { type EditUserControllerErrors, editUserController } from "./controller";
import { pick } from "lodash-es";
import type { StatusCode } from "hono/utils/http-status";
import { buildErrorResponse, buildResponse } from "~/shared/utils/http";

// Handling user input
// Displaying data

type EditUserViewErrors = EditUserControllerErrors | CommonErrors.ServerError | CommonErrors.UnexpectedServerError;

export const editUserView = async (context: Context) => {
  let createUserResult: Result<User, EditUserViewErrors>;
  try {
    createUserResult = await editUserController(context);
  } catch (err) {
    createUserResult = Err(CommonErrors.ServerError);
  }

  return match(createUserResult, {
    Ok: (data: User) => {
      const user = pick(data, ["id", "email", "username", "firstName", "lastName"]);
      return buildResponse<void, User>(context)({ data: user }, 201);
    },
    Err: [
      [CommonErrors.ValidationError, buildErrorResponse<EditUserViewErrors>(context)(400)],
      [UserErrors.UserNotFound, buildErrorResponse<EditUserViewErrors>(context)(404)],
      [UserErrors.UsernameAlreadyTaken, buildErrorResponse<EditUserViewErrors>(context)(409)],
      [UserErrors.EmailAlreadyInUse, buildErrorResponse<EditUserViewErrors>(context)(409)],
      [CommonErrors.ServerError, buildErrorResponse<EditUserViewErrors>(context)(500)],
    ],
    _: () => buildErrorResponse<EditUserViewErrors>(context)(500)(CommonErrors.UnexpectedServerError),
  });
};
