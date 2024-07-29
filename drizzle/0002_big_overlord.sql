DO $$ BEGIN
 CREATE TYPE "public"."userStatus" AS ENUM('novice', 'intermediate', 'expert');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "fileStatus" ADD VALUE 'obtainable';--> statement-breakpoint
ALTER TYPE "fileStatus" ADD VALUE 'obtained';--> statement-breakpoint
ALTER TYPE "fileStatus" ADD VALUE 'in_review';--> statement-breakpoint
ALTER TYPE "fileStatus" ADD VALUE 'completed';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "status" SET DATA TYPE userStatus;--> statement-breakpoint
ALTER TABLE "userFile" DROP COLUMN IF EXISTS "status";