DO $$ BEGIN
 CREATE TYPE "kader"."user_roles" AS ENUM('owner', 'admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "kader"."kaders" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "kader"."kaders" ADD COLUMN "school" text NOT NULL;--> statement-breakpoint
ALTER TABLE "kader"."kaders" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "kader"."users_to_kaders" ADD COLUMN "user_role" "kader"."user_roles" NOT NULL;