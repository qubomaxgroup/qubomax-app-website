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
  const quote = {
    id: crypto.randomUUID(),
    organizationId,
    leadId,
    subject,
    amount,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    followupDays: Array.isArray(followupDays) && followupDays.length > 0 ? followupDays : [2, 5, 10],
    followUps: [],
    events: [
      {
        id: crypto.randomUUID(),
        type: "quote_sent",
        message: "Quote created and sent",
        createdAt: new Date().toISOString(),
      },
    ],
  };
  db.quoteThreads.push(quote);
  return quote;
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
  appendEventToQuote,
  updateQuoteStatus,
  findOrganization,
  findLead,
  findQuoteThread,
};

