// Modelling behaviour
// Representing data
// Persisting data

import {
	getUserByEmail,
	getUserById,
	getUserByUsername,
} from "@/users/repositories/user.repository";
import { UserErrors } from "@/users/users.errors";
import { eq } from "drizzle-orm";
import { Err, Ok, type Result } from "oxide.ts";
import { db } from "~/shared/infrastructure/database/connection";
import { models } from "~/shared/infrastructure/database/models";
import type {
	EditUser,
	User,
} from "~/shared/infrastructure/database/models/users";

export type EditUserModelErrors =
	| UserErrors.UsernameAlreadyTaken
	| UserErrors.EmailAlreadyInUse
	| UserErrors.UserNotFound;

export const editUserModel = async (
	input: EditUser,
	userId: number,
): Promise<Result<User, EditUserModelErrors>> => {
	console.log({ userId });
	const result = await getUserById(userId);
	if (!result.length) return Err(UserErrors.UserNotFound);
	const user = result[0];

	if (input.username && user.username != input.username) {
		const userByUsername = await getUserByUsername(input.username);
		if (!!userByUsername.length) return Err(UserErrors.UsernameAlreadyTaken);
	}

	if (input.email && user.email != input.email) {
		const userByEmail = await getUserByEmail(input.email);
		if (!!userByEmail.length) return Err(UserErrors.EmailAlreadyInUse);
	}

	const [updatedUser] = await db
		.update(models.users)
		.set(input)
		.where(eq(models.users.id, userId))
		.returning();
	return Ok(updatedUser);
};
