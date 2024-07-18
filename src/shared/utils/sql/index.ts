import { isString } from "class-validator";
import { sql } from "drizzle-orm";

export const lower = (value: unknown) => {
  if (isString(value)) return sql`lower(${value})`;
  throw new Error("UnexpectedServerError in sql/lower. Value is not of type string.");
};
