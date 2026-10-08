import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export async function GET() {
  const content = `# Formu.AI - Comprehensive Developer, Product & AI Knowledge Base

> Website: ${SITE_URL}
> Documentation for AI agents, LLM search engines, and web scrapers.

---

## 1. Executive Summary

Formu.AI is a modern SaaS platform designed to bridge the gap between AI generation and enterprise-grade form collection. It provides instant AI form scaffolding via Google Gemini, live visual theme authoring, one-click JavaScript embedding, and automated response sentiment analysis.

---

## 2. Supported Form Field Types

The builder supports the following validated field definitions:
1. \`text\`: Short single-line input with optional regex/length validation.
2. \`textarea\`: Multi-line text for feedback, messages, and long responses.
3. \`number\`: Numerical entry with min/max bounds.
4. \`email\`: Built-in format checking and RFC 5322 compliance.
5. \`phone\`: Mobile and telephone number formatting.
6. \`select\`: Single selection dropdown menu.
7. \`multiselect\`: Multi-item tag selection.
8. \`checkbox\`: Boolean toggle or terms acceptance.
9. \`radio\`: Exclusive choice option sets.
10. \`rating\`: 1-5 or 1-10 star/numeric score rating.
11. \`date\`: Calendar date picker with ISO 8601 formatting.

---

## 3. Template Catalog Overview

Accessible at \`${SITE_URL}/explore\`:
- **Customer Feedback Form**: Net Promoter Score, feature satisfaction rating, qualitative suggestions.
- **Restaurant Survey**: Dining experience, food quality, ambiance, server evaluation.
- **Newsletter Subscription**: Lead capture, interest preferences, cadence selection.
- **Contact & Sales Lead**: Company name, budget size, timeline, project scope.
- **Event Registration**: Attendee badges, workshop selections, dietary preferences.
- **Job Application**: Resume links, portfolio, experience level, expected salary.
- **Product Satisfaction (CSAT)**: Ease of use, problem resolution, likelihood to recommend.
- **Bug Report & Feature Request**: Steps to reproduce, expected vs actual behavior, severity level.
- **IT Support Ticket**: Device type, operating system, issue category, urgency.

---

## 4. Theme Engine Specification

Formu.AI themes are reactive CSS variable systems supporting:
- **Primary Color**: Accents, buttons, focus rings, selected state highlights.
- **Background Color**: Root canvas or container background.
- **Card Color**: Form card wrapper and surface containers.
- **Text Color**: High-contrast foreground content.
- **Border Radius**: \`0px\` (brutalist/sharp), \`8px\` (standard modern), \`16px\` (soft pill), \`24px\` (ultra rounded).

Themes can be previewed at \`${SITE_URL}/themes\` and applied with a single click.

---

## 5. Pricing Tiers

Accessible at \`${SITE_URL}/pricing\`:
1. **Free Tier ($0/mo)**:
   - Up to 5 active forms
   - 2 AI form generations
   - 100 submissions per month
   - Standard templates library
   - Full theme & color customization

2. **Pro Tier ($29/mo)**:
   - Unlimited active forms
   - Unlimited submissions
   - 20 AI form generations
   - AI Insights & sentiment reporting engine
   - Recharts analytics dashboard
   - Custom slugs & CSV export

3. **Enterprise Tier ($99/mo or Custom)**:
   - Dedicated database clusters
   - Premium SLA support
   - Developer API & Webhook access
   - SAML/SSO authentication
   - Advanced Redis rate limits

---

## 6. How to Embed Forms

### External Webpage Integration
To embed any public form on WordPress, Webflow, Shopify, or plain HTML:
\`\`\`html
<div id="formu-embed-container"></div>
<script src="${SITE_URL}/embed.js" data-form-id="YOUR_FORM_ID" async></script>
\`\`\`

### Direct Share Link
\`\`\`
${SITE_URL}/f/[form-slug]
\`\`\`

---

## 7. Developer & Security Overview

- **Authentication**: NextAuth.js v5 supporting Credentials, Google OAuth, and OTP verification.
- **Authorization**: Role-based access control (Admin, User, Demo sandbox).
- **Rate Limiting**: Sliding window rate limiting enforced via Redis.
- **Security Headers**: HSTS, X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN.
- **Data Protection**: GDPR-ready data isolation, 256-bit AES database encryption at rest.

---

## 8. Contact & Company Information

- **Company**: Formu.AI
- **Contact URL**: ${SITE_URL}/contact
- **GitHub Repository**: https://github.com/raaam02/sec-form
- **Twitter / X**: @FormuAI
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}
