const express = require("express");
const {
  loadData,
  saveData,
  createOrganization,
  createLead,
  createQuoteThread,
  appendEventToQuote,
  updateQuoteStatus,
  findOrganization,
  findLead,
  findQuoteThread,
} = require("./dataStore");
const {
  scheduleFollowUps,
  cancelPendingFollowUps,
  runDueFollowUps,
  toSummary,
} = require("./followupEngine");
const { seedIfEmpty } = require("./sampleData");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  if (!req.path.startsWith("/api/")) {
    return next();
  }
  req.db = loadData();
  return next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "quote-followup-assistant" });
});

app.get("/api/organizations", (req, res) => {
  res.json(req.db.organizations);
});

app.post("/api/organizations", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
  }
  const org = createOrganization(req.db, name.trim());
  saveData(req.db);
  res.status(201).json(org);
});

app.get("/api/leads", (req, res) => {
  const { organizationId } = req.query;
  const leads = organizationId
    ? req.db.leads.filter((lead) => lead.organizationId === organizationId)
    : req.db.leads;
  res.json({ leads });
});

app.post("/api/leads", (req, res) => {
  const { organizationId, name, email, company } = req.body;
  if (!organizationId || !name || !email) {
    return res.status(400).json({ error: "organizationId, name, and email are required" });
  }
  if (!findOrganization(req.db, organizationId)) {
    return res.status(404).json({ error: "organization not found" });
  }
  const lead = createLead(req.db, {
    organizationId,
    name: String(name).trim(),
    email: String(email).trim(),
    company: String(company || "").trim(),
  });
  saveData(req.db);
  res.status(201).json(lead);
});

app.get("/api/quotes", (req, res) => {
  const { organizationId, status } = req.query;
  let quotes = req.db.quoteThreads;
  if (organizationId) {
    quotes = quotes.filter((quote) => quote.organizationId === organizationId);
  }
  if (status) {
    quotes = quotes.filter((quote) => quote.status === status);
  }
  res.json({ quotes: quotes.map((quote) => toSummary(quote, req.db)) });
});

app.post("/api/quotes", (req, res) => {
  const { organizationId, leadId, subject, amount, followupDays } = req.body;
  if (!organizationId || !leadId || !subject || typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ error: "organizationId, leadId, subject, and positive numeric amount are required" });
  }
  if (!findOrganization(req.db, organizationId)) {
    return res.status(404).json({ error: "organization not found" });
  }
  const lead = findLead(req.db, leadId);
  if (!lead) {
    return res.status(404).json({ error: "lead not found" });
  }
  const quote = createQuoteThread(req.db, {
    organizationId,
    leadId,
    subject,
    amount,
    followupDays: Array.isArray(followupDays) ? followupDays : undefined,
  });
  quote.leadName = lead.name;
  quote.leadEmail = lead.email;
  quote.sentAt = quote.createdAt;
  scheduleFollowUps(quote);
  saveData(req.db);
  res.status(201).json(toSummary(quote, req.db));
});

app.post("/api/quotes/:id/reply", (req, res) => {
  const quote = findQuoteThread(req.db, req.params.id);
  if (!quote) {
    return res.status(404).json({ error: "quote not found" });
  }
  appendEventToQuote(quote, "replied", "Lead replied to follow-up");
  cancelPendingFollowUps(quote);
  updateQuoteStatus(quote, "replied");
  saveData(req.db);
  res.json(toSummary(quote, req.db));
});

app.post("/api/quotes/:id/won", (req, res) => {
  const quote = findQuoteThread(req.db, req.params.id);
  if (!quote) {
    return res.status(404).json({ error: "quote not found" });
  }
  appendEventToQuote(quote, "won", "Quote accepted and won");
  cancelPendingFollowUps(quote);
  updateQuoteStatus(quote, "won");
  saveData(req.db);
  res.json(toSummary(quote, req.db));
});

app.post("/api/quotes/:id/lost", (req, res) => {
  const quote = findQuoteThread(req.db, req.params.id);
  if (!quote) {
    return res.status(404).json({ error: "quote not found" });
  }
  appendEventToQuote(quote, "lost", "Quote marked as lost");
  cancelPendingFollowUps(quote);
  updateQuoteStatus(quote, "lost");
  saveData(req.db);
  res.json(toSummary(quote, req.db));
});

app.get("/api/dashboard/:organizationId", (req, res) => {
  const org = findOrganization(req.db, req.params.organizationId);
  if (!org) {
    return res.status(404).json({ error: "organization not found" });
  }
  const orgQuotes = req.db.quoteThreads.filter((quote) => quote.organizationId === org.id);
  const pending = orgQuotes.filter((quote) => quote.status === "pending");
  const replied = orgQuotes.filter((quote) => quote.status === "replied");
  const won = orgQuotes.filter((quote) => quote.status === "won");
  const lost = orgQuotes.filter((quote) => quote.status === "lost");
  const totalPipelineValue = pending.reduce((sum, quote) => sum + quote.amount, 0);
  const totalWonValue = won.reduce((sum, quote) => sum + quote.amount, 0);
  const overdueFollowups = pending
    .flatMap((quote) => quote.followUps)
    .filter((item) => item.status === "pending" && new Date(item.scheduledAt).getTime() < Date.now()).length;
  res.json({
    organization: org,
    metrics: {
      totalQuotes: orgQuotes.length,
      pendingQuotes: pending.length,
      repliedQuotes: replied.length,
      wonQuotes: won.length,
      lostQuotes: lost.length,
      pipelineValue: totalPipelineValue,
      wonValue: totalWonValue,
      overdueFollowups,
    },
    quotes: orgQuotes.map((quote) => toSummary(quote, req.db)),
  });
});

app.post("/api/followups/run", (req, res) => {
  const events = runDueFollowUps(req.db.quoteThreads);
  saveData(req.db);
  res.json({ processed: events.length, events });
});

app.post("/api/seed", (req, res) => {
  const added = seedIfEmpty(req.db);
  saveData(req.db);
  if (!added) {
    return res.status(200).json({ ok: true, seeded: false, message: "Demo data already exists" });
  }
  res.status(201).json({ ok: true, seeded: true, message: "Demo data created" });
});

function bootstrap() {
  const db = loadData();
  seedIfEmpty(db);
  saveData(db);
  app.listen(PORT, () => {
    console.log(`Quote Follow-up Assistant running on http://localhost:${PORT}`);
  });
}

bootstrap();
