# Formu.AI - AI Form Builder SaaS MVP

Formu.AI is a modern, high-performance, hackathon-ready AI-powered form builder (similar to Google Forms) equipped with AI form generation, visual drag-and-drop workspace controls, preset themes, Recharts statistics dashboards, Gemini-powered analytics summaries, custom slugs, and embed scripts.

This application is built as a separate frontend and backend monorepo managed with **Turborepo** and **NPM Workspaces**.

---

## 🚀 Quick Start (Demo Account)

For review by judges and testing:
- **Demo Account Email**: `demo@demo.com`
- **Demo Account Password**: `demo123`
- *Note*: An authentication bypass is implemented in development/credentials mode so you can evaluate the dashboard, analytics, and form-building interfaces immediately without setting up Google OAuth.

---

## 🛠️ Technology Stack

- **Monorepo Manager**: Turborepo, NPM Workspaces
- **Frontend Client (`apps/web`)**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide icons
- **Backend API (`apps/api`)**: Node.js, Express, tRPC (v10), Gemini AI SDK (`@google/generative-ai`)
- **Database Layer (`packages/db`)**: PostgreSQL, Drizzle ORM
- **Cache & Rate Limiting (`apps/api/src/redis.ts`)**: Redis (with automatic developer In-Memory fallback)
- **API Documentation**: Scalar UI (available at `/docs`)
- **Authentication**: Auth.js (NextAuth v5), Google OAuth + Developer Credentials Provider
- **Infrastructure**: Docker Compose

---

## 📂 Monorepo Structure

```
apps/
  web/          <- Next.js 15 client frontend (Tailwind CSS, tRPC client, Auth.js)
  api/          <- Express server backend (tRPC endpoints, REST APIs, Scalar docs)

packages/
  db/           <- Drizzle ORM schemas, migration runners, and 30-day timeline database seeders
  shared/       <- Common typescript interfaces, preset themes, and template catalogs
  validators/   <- Zod validators shared between client and server (including dynamic runtime checks)
  ui/           <- Common utility widgets (spinners, error messages)
  config/       <- TypeScript and workspaces compiler parameters
```

---

## 🐳 Running with Docker (Recommended)

To spin up the database, cache, backend server, and frontend web app automatically:

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Start the container group:
   ```bash
   docker compose up --build
   ```
3. Once running:
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Backend Express Server**: [http://localhost:4000](http://localhost:4000)
   - **Scalar API Documentation**: [http://localhost:4000/docs](http://localhost:4000/docs)
   - **OpenAPI Schema JSON**: [http://localhost:4000/openapi.json](http://localhost:4000/openapi.json)

---

## 💻 Running Locally

If you prefer to run the services on your host machine without Docker:

### Prerequisites
Make sure you have Node.js (v20+) and local PostgreSQL and Redis servers running. Update your `.env` connection URLs.

### 1. Install Workspace Dependencies
From the monorepo root directory, install and link all workspaces:
```bash
npm install
```

### 2. Generate and Run Database Migrations
Initialize database tables using Drizzle ORM:
```bash
# Generate SQL migrations files
npm run db:generate

# Execute migrations on target PostgreSQL
npm run db:migrate
```

### 3. Seed Hackathon Mock Data
Insert the developer demo account, 5 pre-configured template forms, and **100+ submissions distributed across a 30-day timeline** to populate the Recharts analytics out-of-the-box:
```bash
npm run db:seed
```

### 4. Run Development Servers
Start both the Next.js client and the Express tRPC server concurrently using Turborepo:
```bash
npm run dev
```

The services will start on:
- Web: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:4000](http://localhost:4000)

---

## ⚡ Key Feature Walkthrough

1. **Google OAuth & Credentials Login**: Log in securely using Google or input the demo credentials at `/login` to access the protected dashboard.
2. **AI Form Generator**: Enter a prompt (e.g. *"feedback survey for a restaurant visit"*) and watch the backend prompt Gemini to generate a clean Zod-validated schema, redirecting you straight to the builder workspace.
3. **Visual Form Builder**: Add, edit, and reorder fields (Short Text, Long Text, Email, Number, Single Select, Multi Select, Checkbox, Rating, Date) with live preview updates.
4. **Themes presets & AI Theme Engine**: Toggle built-in themes (Minimal, Modern SaaS, Dark, Corporate, Gradient) or write a prompt like *"neon retro style"* to generate colors and border radiuses.
5. **Responses Grid & CSV Export**: Check raw submission lists and compile custom CSV downloads.
6. **Recharts Analytics & Gemini insights**: Inspect total views, response rates, conversion rate indicators, and visual charts. Click "Analyze Feedbacks" to prompt Gemini to compile a report detailing summaries, sentiments, keywords, common complaints, and recommendations based on submissions.
7. **Embed Settings & mobile sharing**: Copy iframe embedding scripts, script tag SDK loaders, or scan dynamically generated QR codes.
