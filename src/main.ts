import { Hono } from "hono";
import { db, databaseHealthCheck } from "./shared/infrastructure/database";

databaseHealthCheck(db);

const app = new Hono();

app.get("/health", (context) => {
  context.status(200);
  return context.text("OK");
});

// Create a new user
app.post("/users/new", (context) => {
  // ...
});

// Edit a user
app.post("/users/edit/:userId", (context) => {
  // ...
});

// Get a user by email
app.get("/users", (context) => {
  // ...
});

export default app;
