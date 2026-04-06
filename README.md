# Quote Follow-up Assistant

Quote Follow-up Assistant is a clean replacement app built for one purpose: help teams follow up every quote consistently until the prospect replies or the opportunity is closed.

## What this app does

- tracks organizations, leads, and quote threads
- auto-schedules follow-ups (default cadence: day 2, day 5, day 10)
- sends due follow-ups when scheduler runs
- cancels pending follow-ups when a lead replies
- allows marking quotes as won/lost
- shows dashboard metrics and quote-level actions

## Tech stack

- Runtime: Node.js 20+
- Backend: Express 5
- Frontend: Vanilla HTML/CSS/JS
- Storage: Local JSON file (`data/db.local.json`)
- Testing: Node built-in test runner (`node --test`)

## Project structure

```text
.
├── data/
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── src/
│   ├── dataStore.js
│   ├── followupEngine.js
│   ├── models.js
│   ├── sampleData.js
│   └── server.js
├── tests/
│   └── followupEngine.test.js
├── package.json
└── README.md
```

## API overview

### Health

- `GET /api/health`

### Organizations

- `GET /api/organizations`
- `POST /api/organizations`
  - body:
    ```json
    { "name": "Qubomax Services" }
    ```

### Leads

- `GET /api/leads?organizationId=<orgId>`
- `POST /api/leads`
  - body:
    ```json
    {
      "organizationId": "<orgId>",
      "name": "Apex Roofing",
      "email": "ops@apex-roofing.example",
      "company": "Apex Roofing"
    }
    ```

### Quotes

- `GET /api/quotes?organizationId=<orgId>&status=pending`
- `POST /api/quotes`
  - body:
    ```json
    {
      "organizationId": "<orgId>",
      "leadId": "<leadId>",
      "subject": "Commercial roof patching",
      "amount": 12500,
      "followupDays": [2, 5, 10]
    }
    ```
- `POST /api/quotes/:id/reply`
- `POST /api/quotes/:id/won`
- `POST /api/quotes/:id/lost`

### Scheduler and dashboard

- `POST /api/followups/run`
- `GET /api/dashboard/:organizationId`
- `POST /api/seed` (seed sample organization/leads/quotes if database is empty)

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start app:

```bash
npm run dev
```

3. Open dashboard:

```text
http://localhost:3000
```

4. Run tests:

```bash
npm test
```

## Next upgrades (optional)

- move from JSON storage to Postgres + Prisma
- add Gmail/Outlook OAuth ingestion
- run scheduler as background job (Inngest or Trigger.dev)
- add Stripe billing and multi-tenant auth

