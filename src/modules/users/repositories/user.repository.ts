import { db } from "~/shared/infrastructure/database/connection";
import { models } from "~/shared/infrastructure/database/models";
import { eq } from "drizzle-orm";
import { lower } from "~/shared/utils/sql";

export const getUserByUsername = async (value: string) => {
  return await db
    .select()
    .from(models.users)
    .where(eq(lower(models.users.username), value.toLowerCase()));
};

export const getUserByEmail = async (value: string) => {
  return await db
    .select()
    .from(models.users)
    .where(eq(lower(models.users.email), value.toLowerCase()));
};
