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
  findLeadByEmail,
  findQuoteByGmailThread,
  upsertGmailConnection,
  getGmailConnection,
} = require("./dataStore");
const {
  scheduleFollowUps,
  cancelPendingFollowUps,
  runDueFollowUps,
  toSummary,
} = require("./followupEngine");
const {
  hasGmailConfig,
  buildAuthUrl,
  exchangeCodeForTokens,
  getProfile,
  syncQuotesFromSent,
} = require("./gmailService");
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
  res.json({ organizations: req.db.organizations });
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

app.post("/api/quotes/:id/reopen", (req, res) => {
  const quote = findQuoteThread(req.db, req.params.id);
  if (!quote) {
    return res.status(404).json({ error: "quote not found" });
  }
  if (quote.status === "pending") {
    return res.status(200).json(toSummary(quote, req.db));
  }
  appendEventToQuote(quote, "reopened", "Quote reopened after status update");
  updateQuoteStatus(quote, "pending");
  quote.followUps = [];
  scheduleFollowUps(quote);
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

app.get("/api/gmail/status", (req, res) => {
  const organizationId = req.query.organizationId;
  if (!organizationId || typeof organizationId !== "string") {
    return res.status(400).json({ error: "organizationId is required" });
  }
  const connection = getGmailConnection(req.db, organizationId);
  res.json({
    configured: hasGmailConfig(),
    connected: Boolean(connection),
    email: connection ? connection.email : null,
    connectedAt: connection ? connection.connectedAt : null,
    lastSyncAt: connection ? connection.lastSyncAt || null : null,
  });
});

app.get("/api/gmail/connect-url", (req, res) => {
  try {
    const organizationId = req.query.organizationId;
    if (!organizationId || typeof organizationId !== "string") {
      return res.status(400).json({ error: "organizationId is required" });
    }
    const authUrl = buildAuthUrl(organizationId);
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({
      error: "Gmail OAuth is not configured. Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REDIRECT_URI.",
    });
  }
});

app.get("/api/gmail/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code || typeof code !== "string") {
      return res.status(400).send("Missing OAuth code");
    }
    const organizationId = req.query.state;
    if (!organizationId || typeof organizationId !== "string") {
      return res.status(400).send("Missing organization state");
    }
    const tokens = await exchangeCodeForTokens(code);
    const profile = await getProfile(tokens);
    const email = profile.emailAddress || null;
    if (!email) {
      return res.status(400).send("Could not determine Gmail account email");
    }
    const db = loadData();
    if (!findOrganization(db, organizationId)) {
      return res.status(400).send("Invalid organization in OAuth state");
    }
    upsertGmailConnection(db, { organizationId, email, tokens });
    saveData(db);
    res.redirect("/?gmail=connected");
  } catch (error) {
    res.status(500).send("Failed to complete Gmail OAuth callback");
  }
});

app.post("/api/gmail/sync", async (req, res) => {
  try {
    const { organizationId } = req.body;
    if (!organizationId || typeof organizationId !== "string") {
      return res.status(400).json({ error: "organizationId is required" });
    }
    const org = findOrganization(req.db, organizationId);
    if (!org) {
      return res.status(404).json({ error: "organization not found" });
    }
    const connection = getGmailConnection(req.db, organizationId);
    if (!connection) {
      return res.status(400).json({ error: "Gmail is not connected" });
    }
    const candidates = await syncQuotesFromSent({
      tokens: connection.tokens,
      maxResults: 20,
    });
    let importedQuotes = 0;
    let createdLeads = 0;
    let skipped = 0;
    for (const candidate of candidates) {
      if (!candidate || !candidate.gmailThreadId || !candidate.recipientEmail) {
        skipped += 1;
        continue;
      }
      if (findQuoteByGmailThread(req.db, organizationId, candidate.gmailThreadId)) {
        skipped += 1;
        continue;
      }

      let lead = findLeadByEmail(req.db, organizationId, candidate.recipientEmail);
      if (!lead) {
        lead = createLead(req.db, {
          organizationId: organizationId,
          name: candidate.recipientName || candidate.recipientEmail.split("@")[0],
          email: candidate.recipientEmail,
          company: candidate.recipientName || "",
        });
        createdLeads += 1;
      }

      const quote = createQuoteThread(req.db, {
        organizationId: organizationId,
        leadId: lead.id,
        subject: candidate.subject || "Imported Gmail quote",
        amount: candidate.amount || 1000,
        followupDays: [2, 5, 10],
      });
      quote.sentAt = candidate.sentAt || quote.createdAt;
      quote.gmail = {
        threadId: candidate.gmailThreadId,
        messageId: candidate.gmailMessageId,
      };
      quote.source = "gmail";
      quote.leadName = lead.name;
      quote.leadEmail = lead.email;
      scheduleFollowUps(quote);
      importedQuotes += 1;
    }

    upsertGmailConnection(req.db, {
      organizationId,
      email: connection.email,
      tokens: connection.tokens,
      connectedAt: connection.connectedAt,
      lastSyncAt: new Date().toISOString(),
    });
    saveData(req.db);
    res.json({ importedQuotes, createdLeads, skipped, scanned: candidates.length });
  } catch (error) {
    res.status(500).json({
      error: `Failed to sync Gmail quotes: ${error.message}`,
    });
  }
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
