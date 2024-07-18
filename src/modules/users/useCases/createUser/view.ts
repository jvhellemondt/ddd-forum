import { UserErrors } from "@/users/users.errors";
import type { Context } from "hono";
import { pick } from "lodash-es";
import { Err, type Result, match } from "oxide.ts";
import { ulid } from "ulid";
import { CommonErrors } from "~/shared/common/errors";
import type { User } from "~/shared/infrastructure/database/models/users";
import { buildErrorResponse, buildResponse } from "~/shared/utils/http";
import {
	type CreateUserControllerErrors,
	createUserController,
} from "./controller";

// Handling user input
// Displaying data

type CreateUserViewErrors =
	| CreateUserControllerErrors
	| CommonErrors.ServerError
	| CommonErrors.UnexpectedServerError;

export const createUserView = async (context: Context) => {
	let createUserResult: Result<User, CreateUserViewErrors>;
	try {
		const body = await context.req.json();
		createUserResult = await createUserController({
			password: ulid(),
			...body,
		});
	} catch (err) {
		console.error(err);
		createUserResult = Err(CommonErrors.ServerError);
	}

	return match(createUserResult, {
		Ok: (data: User) => {
			const user = pick(data, [
				"id",
				"email",
				"username",
				"firstName",
				"lastName",
			]);
			return buildResponse<void, User>(context)({ data: user }, 201);
		},
		Err: [
			[
				CommonErrors.ValidationError,
				buildErrorResponse<CreateUserViewErrors>(context)(400),
			],
			[
				UserErrors.UsernameAlreadyTaken,
				buildErrorResponse<CreateUserViewErrors>(context)(409),
			],
			[
				UserErrors.EmailAlreadyInUse,
				buildErrorResponse<CreateUserViewErrors>(context)(409),
			],
			[
				CommonErrors.ServerError,
				buildErrorResponse<CreateUserViewErrors>(context)(500),
			],
		],
		_: () =>
			buildErrorResponse<CreateUserViewErrors>(context)(500)(
				CommonErrors.UnexpectedServerError,
			),
	});
};
