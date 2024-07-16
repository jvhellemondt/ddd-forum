import { users } from "./users";
import type { User, InsertUser } from "./users";

export const models = {
  users,
};

export interface Models {
  User: User;
  InsertUser: InsertUser;
}
