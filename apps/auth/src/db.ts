import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@badbird/db/schema";

export function createDb(env: {
  DATABASE_URL: string;
}) {
  return drizzle(env.DATABASE_URL, {
    schema,
  });
}

export * from "@badbird/db/schema";