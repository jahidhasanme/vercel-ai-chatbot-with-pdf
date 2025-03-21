ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "full_name" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "profileImage" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "dob" varchar(10);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "gender" varchar;