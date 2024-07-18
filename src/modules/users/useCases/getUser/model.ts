// Modelling behaviour
// Representing data
// Persisting data

import { type User } from "~/shared/infrastructure/database/models/users";
import { Err, Ok, Result } from "oxide.ts";
import { UserErrors } from "@/users/users.errors";
import { getUserByEmail } from "@/users/repositories/user.repository";

export const getUserModel = async (email: string): Promise<Result<User, UserErrors.UserNotFound>> => {
  const result = await getUserByEmail(email);
  if (!result.length) return Err(UserErrors.UserNotFound);
  const user = result[0];
  return Ok(user);
};
