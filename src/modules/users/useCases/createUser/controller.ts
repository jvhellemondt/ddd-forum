// Validating requests
// Handling requests

import { isObject } from "class-validator";
import { isEmpty } from "lodash-es";
import { Err, type Result } from "oxide.ts";
import { CommonErrors } from "~/shared/common/errors";
import type {
	InsertUser,
	User,
} from "~/shared/infrastructure/database/models/users";
import { type CreateUserModelErrors, createUserModel } from "./model";

const hasUserInsertFields = (input: object) => {
	const fields = ["email", "username", "firstName", "lastName"];
	return fields.some((field) => isEmpty(input[field as keyof typeof input]));
};

const isUserInputValid = (input: unknown): input is InsertUser => {
	if (isEmpty(input)) return false;
	if (isObject(input) && hasUserInsertFields(input)) return false;
	return true;
};

export type CreateUserControllerErrors =
	| CommonErrors.ValidationError
	| CreateUserModelErrors;

export const createUserController = async (
	body: Record<string, unknown>,
): Promise<Result<User, CreateUserControllerErrors>> => {
	if (!isUserInputValid(body)) return Err(CommonErrors.ValidationError);
	return await createUserModel(body);
};
