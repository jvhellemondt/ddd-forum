import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import type { Maybe } from "~/shared/common/types";

export const buildResponse =
	<E, T = void>(context: Context) =>
	(
		result: { error?: Maybe<E>; data?: Maybe<Partial<T>> },
		code: StatusCode = 500,
	) => {
		context.status(code);
		return context.json({
			...result,
			success: !result.error,
		});
	};

export const buildErrorResponse =
	<E>(context: Context) =>
	(code: StatusCode = 500) =>
	(error: E) =>
		buildResponse(context)<E>({ error }, code);
