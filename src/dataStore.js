const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { defaultDatabase } = require("./models");

const DB_PATH = path.join(process.cwd(), "data", "db.local.json");

function loadData() {
  if (!fs.existsSync(DB_PATH)) {
    return defaultDatabase();
  }
  const raw = fs.readFileSync(DB_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaultDatabase();
    }
    return {
      organizations: Array.isArray(parsed.organizations) ? parsed.organizations : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      quoteThreads: Array.isArray(parsed.quoteThreads) ? parsed.quoteThreads : [],
      gmailConnections: Array.isArray(parsed.gmailConnections) ? parsed.gmailConnections : [],
      version: parsed.version || 1,
    };
  } catch {
    return defaultDatabase();
  }
}

function saveData(data) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

function createOrganization(db, name) {
  const org = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  };
  db.organizations.push(org);
  return org;
}

function createLead(db, { organizationId, name, email, company }) {
  const lead = {
    id: crypto.randomUUID(),
    organizationId,
    name,
    email,
    company,
    createdAt: new Date().toISOString(),
  };
  db.leads.push(lead);
  return lead;
}

function createQuoteThread(db, { organizationId, leadId, subject, amount, followupDays }) {
  const createdAt = new Date().toISOString();
  const quote = {
    id: crypto.randomUUID(),
    organizationId,
    leadId,
    subject,
    amount,
    status: "pending",
    createdAt,
    sentAt: createdAt,
    updatedAt: createdAt,
    followupDays: Array.isArray(followupDays) && followupDays.length > 0 ? followupDays : [2, 5, 10],
    followUps: [],
    events: [
      {
        id: crypto.randomUUID(),
        type: "quote_sent",
        message: "Quote created and sent",
        createdAt,
      },
    ],
  };
  db.quoteThreads.push(quote);
  return quote;
}

function findLeadByEmail(db, organizationId, email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return db.leads.find(
    (lead) =>
      lead.organizationId === organizationId &&
      String(lead.email || "").trim().toLowerCase() === normalizedEmail
  );
}

function findQuoteByGmailThread(db, organizationId, gmailThreadId) {
  return db.quoteThreads.find(
    (quote) =>
      quote.organizationId === organizationId &&
      (quote.gmailThreadId === gmailThreadId ||
        (quote.gmail && quote.gmail.threadId === gmailThreadId))
  );
}

function upsertGmailConnection(db, { organizationId, email, tokens, connectedAt, lastSyncAt }) {
  const existing = db.gmailConnections.find((conn) => conn.organizationId === organizationId);
  const record = {
    organizationId,
    email,
    tokens,
    connectedAt: connectedAt || new Date().toISOString(),
    lastSyncAt: lastSyncAt || null,
    updatedAt: new Date().toISOString(),
  };
  if (existing) {
    existing.email = record.email;
    existing.tokens = record.tokens;
    existing.lastSyncAt = record.lastSyncAt;
    existing.updatedAt = record.updatedAt;
    return existing;
  }
  db.gmailConnections.push(record);
  return record;
}

function getGmailConnection(db, organizationId) {
  return db.gmailConnections.find((conn) => conn.organizationId === organizationId) || null;
}

function appendEventToQuote(quote, type, message) {
  quote.events.push({
    id: crypto.randomUUID(),
    type,
    message,
    createdAt: new Date().toISOString(),
  });
  quote.updatedAt = new Date().toISOString();
}

function updateQuoteStatus(quote, status) {
  quote.status = status;
  quote.updatedAt = new Date().toISOString();
}

function findOrganization(db, id) {
  return db.organizations.find((org) => org.id === id);
}

function findLead(db, id) {
  return db.leads.find((lead) => lead.id === id);
}

function findQuoteThread(db, id) {
  return db.quoteThreads.find((quote) => quote.id === id);
}

module.exports = {
  loadData,
  saveData,
  createOrganization,
  createLead,
  createQuoteThread,
  findLeadByEmail,
  findQuoteByGmailThread,
  appendEventToQuote,
  updateQuoteStatus,
  upsertGmailConnection,
  getGmailConnection,
  findOrganization,
  findLead,
  findQuoteThread,
};

