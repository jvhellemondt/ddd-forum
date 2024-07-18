// Validating requests
// Handling requests

import { isObject } from "class-validator";
import { isEmpty } from "lodash-es";
import { Err, type Result } from "oxide.ts";
import { CommonErrors } from "~/shared/common/errors";
import type { InsertUser, User } from "~/shared/infrastructure/database/models/users";
import { type CreateUserModelErrors, createUserModel } from "./model";

const insertUserAllowedFields = ["email", "username", "firstName", "lastName", "password"];

const hasEveryInsertUserFields = (input: object) => {
  return insertUserAllowedFields.every((field) => !isEmpty(input[field as keyof typeof input]));
};

const hasOnlyInsertUserFields = (input: object): input is InsertUser => {
  return Object.keys(input).every((key) => insertUserAllowedFields.includes(key));
};

const isUserInsertValid = (input: unknown): input is InsertUser => {
  return isObject(input) && hasEveryInsertUserFields(input) && hasOnlyInsertUserFields(input);
};

export type CreateUserControllerErrors = CommonErrors.ValidationError | CreateUserModelErrors;

export const createUserController = async (
  body: Record<string, unknown>,
): Promise<Result<User, CreateUserControllerErrors>> => {
  if (!isUserInsertValid(body)) return Err(CommonErrors.ValidationError);
  return await createUserModel(body);
};
