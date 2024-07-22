// Modelling behaviour
// Representing data
// Persisting data

import { getUserByEmail } from "@/users/repositories/user.repository";
import { UserErrors } from "@/users/users.errors";
import { Err, Ok, type Result } from "oxide.ts";
import type { User } from "~/shared/infrastructure/database/models/users";

export const getUserModel = async (
	email: string,
): Promise<Result<User, UserErrors.UserNotFound>> => {
	const result = await getUserByEmail(email);
	if (!result.length) return Err(UserErrors.UserNotFound);
	const user = result[0];
	return Ok(user);
};
