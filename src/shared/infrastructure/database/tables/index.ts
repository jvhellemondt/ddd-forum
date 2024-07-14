import { db } from "../connection";
import { createUsersTableQuery } from "./users";

db.run(createUsersTableQuery);
