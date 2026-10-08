import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export async function GET() {
  const content = `# Formu.AI - Premium AI-Powered Form Builder
> The modern AI-first platform to build, style, embed, and analyze forms.

Formu.AI is an AI-powered SaaS platform engineered for creating high-converting web forms, questionnaires, and surveys with real-time dynamic styling, Google Gemini intelligence, and automated response sentiment analysis.

## Core Capabilities

- **AI Prompt-to-Form Generation**: Generate production-ready forms from simple text prompts using Gemini AI with smart validation rules and typed schema definitions.
- **Deep Theme & Color Customization**: Granular control over primary colors, card surfaces, background colors, typography, and border radiuses with instant live preview.
- **One-Script Embed**: Embed any published form onto external websites using:
  \`\`\`html
  <script src="${SITE_URL}/embed.js" data-form-id="YOUR_FORM_ID"></script>
  \`\`\`
- **Response Analytics & AI Summaries**: Sentiment breakdown, automated summaries of long-form responses, and submission trends with Recharts analytics.
- **Sandbox Demo Mode**: Test all features instantly using the demo account credentials (\`demo@demo.com\` / \`demo123\`) with local storage persistence.
- **Multi-step Forms**: Supports single-page layout or multi-step progression.

## Canonical Public Endpoints

- **Homepage**: ${SITE_URL}/
- **Template Library**: ${SITE_URL}/explore
- **Theme Gallery**: ${SITE_URL}/themes
- **Pricing & Plans**: ${SITE_URL}/pricing
- **Contact & Support**: ${SITE_URL}/contact
- **Public Form View**: ${SITE_URL}/f/[slug]
- **API Documentation**: ${SITE_URL}/api/docs
- **Full LLM Context**: ${SITE_URL}/llms-full.txt

## Tech Stack & Architecture

- **Web Framework**: Next.js 15 App Router (React 19)
- **API Layer**: tRPC v10 + Next.js Server Actions
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI
- **Database**: PostgreSQL with Drizzle ORM
- **Cache & Rate Limiting**: Redis
- **AI Engine**: Google Gemini Pro (Schema generation & Sentiment analysis)

## API & Integration Reference

- Form submissions can be fetched or posted via tRPC or standard REST API endpoints.
- Webhooks can be configured per form to deliver instant JSON payloads upon response submission.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
