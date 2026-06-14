import { pgTable, text, timestamp, boolean, integer, jsonb, uuid, primaryKey, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ----------------------------------------------------
// AUTH TABLES (Auth.js Schema)
// ----------------------------------------------------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash"), // Standard helper for dev credentials
  role: text("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    userIdIdx: index("accounts_userId_idx").on(table.userId),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_userId_idx").on(table.userId),
  })
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
  })
);

// ----------------------------------------------------
// APP TABLES
// ----------------------------------------------------

export const forms = pgTable(
  "forms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    slug: text("slug").notNull().unique(),
    schemaJson: jsonb("schemaJson").notNull(), // Form fields setup
    themeJson: jsonb("themeJson").notNull(),   // Colors, fonts, radius
    isPublished: boolean("isPublished").default(false).notNull(), // true if public/unlisted
    visibility: text("visibility").default("draft").notNull(), // draft, public, unlisted
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("forms_userId_idx").on(table.userId),
    slugIdx: uniqueIndex("forms_slug_idx").on(table.slug),
  })
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("formId")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    answersJson: jsonb("answersJson").notNull(), // User answers key-value
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    formIdIdx: index("submissions_formId_idx").on(table.formId),
  })
);

export const formViews = pgTable(
  "formViews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("formId")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    formIdIdx: index("formViews_formId_idx").on(table.formId),
  })
);

export const aiModels = pgTable("ai_models", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  provider: text("provider").default("google").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ----------------------------------------------------
// RELATIONS
// ----------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  user: one(users, {
    fields: [forms.userId],
    references: [users.id],
  }),
  submissions: many(submissions),
  views: many(formViews),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  form: one(forms, {
    fields: [submissions.formId],
    references: [forms.id],
  }),
}));

export const formViewsRelations = relations(formViews, ({ one }) => ({
  form: one(forms, {
    fields: [formViews.formId],
    references: [forms.id],
  }),
}));
