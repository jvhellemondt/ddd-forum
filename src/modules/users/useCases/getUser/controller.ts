// Validating requests
// Handling requests

import type { UserErrors } from "@/users/users.errors";
import { isNotEmpty } from "class-validator";
import { isObject, isString } from "lodash-es";
import { Err, type Result } from "oxide.ts";
import { CommonErrors } from "~/shared/common/errors";
import type { User } from "~/shared/infrastructure/database/models/users";
import { getUserModel } from "./model";

const hasUserInsertFields = (input: object): input is { email: unknown } => {
	const fields = ["email"];
	return fields.every((field) =>
		isNotEmpty(input[field as keyof typeof input]),
	);
};

const isUserInputValid = (input: unknown): input is { email: string } => {
	return isObject(input) && hasUserInsertFields(input) && isString(input.email);
};

export type GetUserControllerErrors =
	| CommonErrors.ClientError
	| UserErrors.UserNotFound;

export const getUserController = async (
	props: Record<string, unknown>,
): Promise<Result<User, GetUserControllerErrors>> => {
	if (!isUserInputValid(props)) return Err(CommonErrors.ClientError);
	return await getUserModel(props.email.toLowerCase());
};
