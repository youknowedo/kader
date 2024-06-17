ALTER TYPE "kader"."user_roles" ADD VALUE 'member';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kader"."subscription_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"kader_id" text NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"currency" text NOT NULL
);
