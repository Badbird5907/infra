import { pgTableCreator, jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";

const table = pgTableCreator((name) => `core_${name}`);

export const coreUsers = table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
