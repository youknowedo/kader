ALTER TABLE "user" ADD COLUMN "qr_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_qr_id_unique" UNIQUE("qr_id");