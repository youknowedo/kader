CREATE SCHEMA "kader";
--> statement-breakpoint
CREATE SCHEMA "shared";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kader"."kaders" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kader"."users_to_kaders" (
	"user_id" text NOT NULL,
	"kader_id" text NOT NULL,
	CONSTRAINT "users_to_kaders_user_id_kader_id_pk" PRIMARY KEY("user_id","kader_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shared"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shared"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"given_name" text NOT NULL,
	"surname" text NOT NULL,
	"email" text,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kader"."users_to_kaders" ADD CONSTRAINT "users_to_kaders_kader_id_kaders_id_fk" FOREIGN KEY ("kader_id") REFERENCES "kader"."kaders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shared"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "shared"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
