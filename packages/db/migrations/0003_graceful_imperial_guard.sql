ALTER TABLE "forms" ADD COLUMN "publishedTitle" text;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "publishedDescription" text;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "publishedSchemaJson" jsonb;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "publishedThemeJson" jsonb;