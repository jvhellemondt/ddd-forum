import { users } from "./users";
import type { InsertUser, User } from "./users";

export const models = {
	users,
};

export interface Models {
	User: User;
	InsertUser: InsertUser;
}
