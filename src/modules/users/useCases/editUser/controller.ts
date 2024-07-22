// Validating requests
// Handling requests

import { UserErrors } from "@/users/users.errors";
import { isNumberString, isObject } from "class-validator";
import type { Context } from "hono";
import { isEmpty } from "lodash-es";
import { Err, type Result } from "oxide.ts";
import { CommonErrors } from "~/shared/common/errors";
import type {
	EditUser,
	User,
} from "~/shared/infrastructure/database/models/users";
import { type EditUserModelErrors, editUserModel } from "./model";

const editUserAllowedFields = ["email", "username", "firstName", "lastName"];

const hasSomeEditUserFields = (input: object) => {
	return editUserAllowedFields.some(
		(field) => !isEmpty(input[field as keyof typeof input]),
	);
};

const hasOnlyEditUserFields = (input: object): input is EditUser => {
	return Object.keys(input).every((key) => editUserAllowedFields.includes(key));
};

const isUserUpdateValid = (input: unknown) => {
	return (
		isObject(input) &&
		hasSomeEditUserFields(input) &&
		hasOnlyEditUserFields(input)
	);
};

export type EditUserControllerErrors =
	| CommonErrors.ValidationError
	| EditUserModelErrors;

export const editUserController = async (
	context: Context,
): Promise<Result<User, EditUserControllerErrors>> => {
	const userId = context.req.param("userId");
	if (!isNumberString(userId)) return Err(UserErrors.UserNotFound);

	const body = await context.req.json();
	if (!isUserUpdateValid(body)) return Err(CommonErrors.ValidationError);

	return await editUserModel(body, Number(userId));
};
