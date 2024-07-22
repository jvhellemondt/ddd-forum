// Handling user input
// Displaying data

import { UserErrors } from "@/users/users.errors";
import type { Context } from "hono";
import { pick } from "lodash-es";
import { Err, type Result, match } from "oxide.ts";
import { CommonErrors } from "~/shared/common/errors";
import type { User } from "~/shared/infrastructure/database/models/users";
import { buildErrorResponse, buildResponse } from "~/shared/utils/http";
import { type GetUserControllerErrors, getUserController } from "./controller";

type GetUserViewErrors =
	| GetUserControllerErrors
	| CommonErrors.ClientError
	| CommonErrors.ServerError
	| CommonErrors.UnexpectedServerError;

export const getUserView = async (context: Context) => {
	let getUserResult: Result<User, GetUserViewErrors>;
	try {
		getUserResult = await getUserController(context.req.query());
	} catch (err) {
		getUserResult = Err(CommonErrors.ServerError);
	}

	return match(getUserResult, {
		Ok: (data: User) => {
			const user = pick(data, [
				"id",
				"email",
				"username",
				"firstName",
				"lastName",
			]);
			return buildResponse<void, User>(context)({ data: user }, 200);
		},
		Err: [
			[
				CommonErrors.ClientError,
				buildErrorResponse<GetUserViewErrors>(context)(400),
			],
			[
				UserErrors.UserNotFound,
				buildErrorResponse<GetUserViewErrors>(context)(404),
			],
			[
				CommonErrors.ServerError,
				buildErrorResponse<GetUserViewErrors>(context)(500),
			],
		],
		_: () =>
			buildErrorResponse<GetUserViewErrors>(context)(500)(
				CommonErrors.UnexpectedServerError,
			),
	});
};
