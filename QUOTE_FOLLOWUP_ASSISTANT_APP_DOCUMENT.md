# Quote Follow-up Assistant - Product Document

## 1) App Overview

The **Quote Follow-up Assistant** is a SaaS app for small businesses and service providers that automatically follows up on sent quotes and proposals until the prospect replies or the opportunity is closed.

Its main purpose is to prevent lost revenue caused by inconsistent manual follow-up.

---

## 2) Problem It Solves

Many businesses send quotes but do not consistently follow up because teams are busy. This causes:

- missed opportunities
- slower deal cycles
- lower close rates
- unpredictable cash flow

The app solves this by making quote follow-up automatic, measurable, and repeatable.

---

## 3) Core Use Case

**Primary use case:**  
Automatically follow up every sent quote/proposal until the customer responds.

### Example workflow

1. A business sends a quote by email.
2. The app detects the quote thread.
3. The app schedules follow-ups (for example: day 2, day 5, day 10).
4. If the prospect replies, pending follow-ups are cancelled.
5. The user sees status updates in a dashboard (pending, replied, won, lost).

---

## 4) Key Term: "Lead"

In this app, a **lead** means a potential customer who has shown interest (for example, requested pricing and received a quote).

- Interested contact -> **lead**
- Accepts quote and pays -> **customer**
- Declines or stops responding -> **lost lead**

---

## 5) Target Users

- contractors (HVAC, roofing, remodeling, painting)
- agencies (marketing, design, development)
- freelancers and consultants
- B2B service teams with quote-based sales

---

## 6) Functional Requirements

## MVP Features

1. **User authentication**
   - secure signup/login
2. **Email integration**
   - connect Gmail and/or Outlook via OAuth
3. **Quote tracking**
   - identify and track quote/proposal conversations
4. **Automated follow-up sequences**
   - send scheduled follow-ups at configurable intervals
5. **Reply detection**
   - stop sequence when a prospect responds
6. **Basic dashboard**
   - view pending quotes, replies, won/lost outcomes
7. **Notifications**
   - alerts for replied, stale, or high-value opportunities

## Post-MVP / Expansion Features

- AI-generated follow-up suggestions by tone/persona
- A/B testing for follow-up templates
- CRM integrations (HubSpot, Pipedrive, Salesforce)
- revenue attribution and conversion analytics
- team roles/permissions and audit trails
- multi-channel follow-up (SMS, WhatsApp, voicemail)

---

## 7) Recommended Technology Stack

## Frontend

- **Next.js (React) + TypeScript**
- **Tailwind CSS** for UI styling

## Backend / API

- **Next.js Route Handlers** (or **tRPC**) in TypeScript
- background workflow endpoints for scheduling and event handling

## Database

- **PostgreSQL** (Supabase / Neon / AWS RDS)
- **Prisma ORM**

## Authentication

- **Clerk** or **Auth.js (NextAuth)**

## Email Integrations

- **Gmail API** (Google OAuth2)
- **Microsoft Graph API** (Outlook OAuth2)

## Job Scheduling / Automation

- **Inngest** or **Trigger.dev**
- optional **Redis (Upstash)** for queue/cache/rate-limiting support

## Payments

- **Stripe** subscription billing

## Observability

- **Sentry** (errors and performance)
- **PostHog** (product analytics)

## Deployment

- **Vercel** for web/app hosting
- managed Postgres provider for database hosting

---

## 8) High-Level Data Model (MVP)

Core entities:

- **User**
- **Organization**
- **InboxConnection** (Gmail/Outlook credentials metadata)
- **Lead**
- **QuoteThread**
- **FollowUpSequence**
- **FollowUpMessage**
- **ConversationEvent** (sent, opened, replied, bounced)
- **Outcome** (won/lost/no decision)

---

## 9) Success Metrics

Primary business metrics:

- quote reply rate
- quote close rate
- time-to-first-follow-up
- recovered revenue from automated follow-up

Operational metrics:

- email send success rate
- webhook/event processing success rate
- failed/cancelled job rate

---

## 10) Value Proposition

The app helps businesses close more deals with less manual effort by ensuring every quote gets timely follow-up and no warm lead is forgotten.

