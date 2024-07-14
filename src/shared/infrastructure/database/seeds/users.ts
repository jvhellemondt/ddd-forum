import { faker } from "@faker-js/faker";
import type { InsertUser } from "../tables/users";

export const generateFakeUsers = (n: number): InsertUser[] => {
  return Array.from({ length: n }, () => ({
    email: faker.internet.email(),
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
  }));
};
