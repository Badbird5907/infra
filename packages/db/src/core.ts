import { pgTableCreator, jsonb, text, timestamp, uuid, boolean, pgTable } from "drizzle-orm/pg-core";

export const coreUsers = pgTable("core_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  admin: boolean("admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
