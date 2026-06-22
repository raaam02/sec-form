CREATE TABLE IF NOT EXISTS "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"prices" jsonb NOT NULL,
	"features" jsonb NOT NULL,
	"maxPublicForms" integer DEFAULT 5 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "plans" ("id", "name", "description", "prices", "features", "maxPublicForms", "createdAt", "updatedAt") 
VALUES 
  ('free', 'Free', 'Perfect for small personal projects and hobbyists.', '{"USD": 0, "INR": 0}', '["5 Active Forms", "Standard Form Layouts", "Basic AI Responses", "Community Support"]', 5, now(), now()),
  ('pro', 'Professional', 'For creators and small businesses needing more capacity.', '{"USD": 29, "INR": 2400}', '["50 Active Forms", "Full Theme & Color Customization", "Allowed Embed Domains", "Advanced AI Insights"]', 50, now(), now()),
  ('enterprise', 'Enterprise', 'For organizations requiring custom scale and high limits.', '{"USD": 99, "INR": 8000}', '["Unlimited Active Forms", "Dedicated Support & SLAs", "Custom Integration Limits", "Priority System Performance"]', 999999, now(), now())
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "planId" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_planId_plans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
