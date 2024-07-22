import { faker } from "@faker-js/faker";
import type { Database } from "~/shared/infrastructure/database/connection";
import { users } from "./table";
import type { InsertUser } from "./table";

export const generateFakeUsers = (n: number): InsertUser[] => {
	return Array.from({ length: n }, () => ({
		email: faker.internet.email(),
		username: faker.internet.userName(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		password: faker.internet.password(),
	}));
};

export const seedUserTable = async (connection: Database) => {
	await Promise.all([
		...generateFakeUsers(100).map(async (user: InsertUser) => {
			return connection.insert(users).values(user).run();
		}),
	]);
	console.info("Users table has been seeded");
};
