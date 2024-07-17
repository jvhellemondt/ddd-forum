// Modelling behaviour
// Representing data
// Persisting data

import { type User } from "~/shared/infrastructure/database/models/users";
import { db } from "~/shared/infrastructure/database/connection";
import { models } from "~/shared/infrastructure/database/models";
import { eq, sql } from "drizzle-orm";
import { Err, Ok, Result } from "oxide.ts";
import { UserErrors } from "@/users/users.errors";

const getUserByEmail = async (value: string) => {
  return await db
    .select()
    .from(models.users)
    .where(eq(sql`lower(${models.users.email})`, value))
    .limit(1);
};

export const getUserModel = async (email: string): Promise<Result<User, UserErrors.UserNotFound>> => {
  const result = await getUserByEmail(email);
  if (!result.length) return Err(UserErrors.UserNotFound);
  const user = result[0];
  return Ok(user);
};
