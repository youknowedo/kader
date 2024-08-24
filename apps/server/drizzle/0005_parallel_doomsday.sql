CREATE TABLE IF NOT EXISTS "vendor" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"owner" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "vendor_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor" ADD CONSTRAINT "vendor_owner_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
