// Modelling behaviour
// Representing data
// Persisting data

import {
	getUserByEmail,
	getUserByUsername,
} from "@/users/repositories/user.repository";
import { UserErrors } from "@/users/users.errors";
import { Err, Ok, type Result } from "oxide.ts";
import { db } from "~/shared/infrastructure/database/connection";
import { models } from "~/shared/infrastructure/database/models";
import type {
	InsertUser,
	User,
} from "~/shared/infrastructure/database/models/users";

export type CreateUserModelErrors =
	| UserErrors.UsernameAlreadyTaken
	| UserErrors.EmailAlreadyInUse;

export const createUserModel = async (
	input: InsertUser,
): Promise<Result<User, CreateUserModelErrors>> => {
	const userByUsername = await getUserByUsername(input.username);
	if (userByUsername.length) return Err(UserErrors.UsernameAlreadyTaken);

	const userByEmail = await getUserByEmail(input.email);
	if (userByEmail.length) return Err(UserErrors.EmailAlreadyInUse);

	const [newUser] = await db.insert(models.users).values(input).returning();
	return Ok(newUser);
};
