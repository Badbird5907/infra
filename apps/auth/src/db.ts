import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@badbird5907/db/schema";

export function createDb(env: {
  DATABASE_URL: string;
}) {
  return drizzle(env.DATABASE_URL, {
    schema,
  });
}

export * from "@badbird5907/db/schema";