// Validating requests
// Handling requests

import { Err, Result } from "oxide.ts";
import { getUserModel } from "./model";
import { CommonErrors } from "~/shared/common/errors";
import { isObject, isString } from "lodash-es";
import { isNotEmpty } from "class-validator";
import type { User } from "~/shared/infrastructure/database/models/users";
import type { UserErrors } from "@/users/users.errors";

const hasUserInsertFields = (input: object): input is { email: unknown } => {
  const fields = ["email"];
  return fields.every((field) => isNotEmpty(input[field as keyof typeof input]));
};

const isUserInputValid = (input: unknown): input is { email: string } => {
  return isObject(input) && hasUserInsertFields(input) && isString(input.email);
};

export type GetUserControllerErrors = CommonErrors.ClientError | UserErrors.UserNotFound;

export const getUserController = async (
  props: Record<string, unknown>,
): Promise<Result<User, GetUserControllerErrors>> => {
  if (!isUserInputValid(props)) return Err(CommonErrors.ClientError);
  return await getUserModel(props.email.toLowerCase());
};
