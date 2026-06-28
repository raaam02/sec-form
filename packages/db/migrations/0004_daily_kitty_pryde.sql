ALTER TABLE "forms" ALTER COLUMN "visibility" SET DEFAULT 'unlisted';--> statement-breakpoint
UPDATE "forms" SET "visibility" = 'unlisted' WHERE "visibility" = 'draft';