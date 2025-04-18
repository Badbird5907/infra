/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    LOG_SQL_QUERIES: z.boolean().optional().default(false),
  },
  client: {
    NEXT_PUBLIC_APP_ENV: z
      .enum(["development", "staging", "production"])
      .default("development"),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    LOG_SQL_QUERIES: process.env.LOG_SQL_QUERIES === "true",
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});