ALTER TABLE "core_users" DROP CONSTRAINT "core_users_username_unique";--> statement-breakpoint
ALTER TABLE "core_users" ADD COLUMN "admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "core_users" DROP COLUMN "username";