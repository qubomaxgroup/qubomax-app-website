const express = require("express");
const {
  ensureDatabase,
  listOrganizations,
  createOrganization,
  findOrganizationById,
  listLeads,
  createLead,
  findLeadById,
  listQuotes,
  createQuote,
  findQuoteById,
  updateQuote,
} = require("./dataStore");
const {
  computeFollowUpDates,
  createFollowups,
  markDueFollowupsAsSent,
  cancelPendingFollowups,
  summarizeDashboard,
  toQuoteSummary,
} = require("./followupEngine");
const { seedSampleData } = require("./sampleData");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "quote-followup-assistant" });
});

app.get("/api/organizations", (req, res) => {
  res.json({ organizations: listOrganizations() });
});

app.post("/api/organizations", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
  }
  const org = createOrganization(name.trim());
  res.status(201).json(org);
});

app.get("/api/leads", (req, res) => {
  const { organizationId } = req.query;
  const leads = listLeads(organizationId);
  res.json({ leads });
});

app.post("/api/leads", (req, res) => {
  const { organizationId, name, email, company } = req.body;
  if (!organizationId || !name || !email) {
    return res.status(400).json({ error: "organizationId, name, and email are required" });
  }
  if (!findOrganizationById(organizationId)) {
    return res.status(404).json({ error: "organization not found" });
  }
  const lead = createLead({
    organizationId,
    name: String(name).trim(),
    email: String(email).trim(),
    company: String(company || "").trim(),
  });
  res.status(201).json(lead);
});

app.get("/api/quotes", (req, res) => {
  const { organizationId, status } = req.query;
  const quotes = listQuotes({ organizationId, status });
  res.json({ quotes: quotes.map(toQuoteSummary) });
});

app.post("/api/quotes", (req, res) => {
  const { organizationId, leadId, title, amount, scheduleOffsetsDays } = req.body;
  if (!organizationId || !leadId || !title || typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ error: "organizationId, leadId, title, and positive numeric amount are required" });
  }
  if (!findOrganizationById(organizationId)) {
    return res.status(404).json({ error: "organization not found" });
  }
  const lead = findLeadById(leadId);
  if (!lead) {
    return res.status(404).json({ error: "lead not found" });
  }

  const sentAt = new Date().toISOString();
  const followUpDates = computeFollowUpDates(sentAt, scheduleOffsetsDays);
  const followups = createFollowups(followUpDates);

  const quote = createQuote({
    organizationId,
    leadId,
    leadName: lead.name,
    leadEmail: lead.email,
    title,
    amount,
    sentAt,
    followups,
  });
  res.status(201).json(toQuoteSummary(quote));
});

app.post("/api/quotes/:id/reply", (req, res) => {
  const quote = findQuoteById(req.params.id);
  if (!quote) {
    return res.status(404).json({ error: "quote not found" });
  }
  quote.status = "replied";
  quote.repliedAt = new Date().toISOString();
  cancelPendingFollowups(quote.followups);
  const updated = updateQuote(quote);
  res.json(toQuoteSummary(updated));
});

app.post("/api/quotes/:id/won", (req, res) => {
  const quote = findQuoteById(req.params.id);
  if (!quote) {
    return res.status(404).json({ error: "quote not found" });
  }
  quote.status = "won";
  quote.closedAt = new Date().toISOString();
  cancelPendingFollowups(quote.followups);
  const updated = updateQuote(quote);
  res.json(toQuoteSummary(updated));
});

app.post("/api/quotes/:id/lost", (req, res) => {
  const quote = findQuoteById(req.params.id);
  if (!quote) {
    return res.status(404).json({ error: "quote not found" });
  }
  quote.status = "lost";
  quote.closedAt = new Date().toISOString();
  cancelPendingFollowups(quote.followups);
  const updated = updateQuote(quote);
  res.json(toQuoteSummary(updated));
});

app.get("/api/dashboard/summary", (req, res) => {
  const summary = summarizeDashboard(listQuotes());
  res.json(summary);
});

app.post("/api/followups/run", (req, res) => {
  const quotes = listQuotes();
  let sentCount = 0;
  for (const quote of quotes) {
    if (quote.status !== "pending") {
      continue;
    }
    sentCount += markDueFollowupsAsSent(quote.followups);
    updateQuote(quote);
  }
  res.json({ sentCount });
});

app.post("/api/seed", (req, res) => {
  const added = seedSampleData();
  if (!added) {
    return res.status(409).json({ error: "seed data already exists" });
  }
  res.status(201).json({ ok: true });
});

function bootstrap() {
  ensureDatabase();
  seedSampleData();
  app.listen(PORT, () => {
    console.log(`Quote Follow-up Assistant running on http://localhost:${PORT}`);
  });
}

bootstrap();
