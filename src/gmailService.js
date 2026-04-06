const { google } = require("googleapis");

const REDIRECT_PATH = "/api/gmail/callback";
const QUOTE_KEYWORDS = ["quote", "proposal", "estimate"];

function getGmailConfig() {
  return {
    clientId: process.env.GMAIL_CLIENT_ID || "",
    clientSecret: process.env.GMAIL_CLIENT_SECRET || "",
    redirectUri:
      process.env.GMAIL_REDIRECT_URI || `http://localhost:3000${REDIRECT_PATH}`,
  };
}

function hasGmailConfig() {
  const cfg = getGmailConfig();
  return Boolean(cfg.clientId && cfg.clientSecret && cfg.redirectUri);
}

function getMissingGmailConfigFields() {
  const cfg = getGmailConfig();
  const missing = [];
  if (!cfg.clientId) {
    missing.push("GMAIL_CLIENT_ID");
  }
  if (!cfg.clientSecret) {
    missing.push("GMAIL_CLIENT_SECRET");
  }
  if (!cfg.redirectUri) {
    missing.push("GMAIL_REDIRECT_URI");
  }
  return missing;
}

function createOAuthClient() {
  const cfg = getGmailConfig();
  if (!cfg.clientId || !cfg.clientSecret || !cfg.redirectUri) {
    const error = new Error("Missing Gmail OAuth configuration");
    error.missing = getMissingGmailConfigFields();
    throw error;
  }
  return new google.auth.OAuth2(cfg.clientId, cfg.clientSecret, cfg.redirectUri);
}

function buildAuthUrl(state = "") {
  const oauth2Client = createOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
    prompt: "consent",
    state,
  });
}

async function exchangeCodeForTokens(code) {
  const oauth2Client = createOAuthClient();
  const tokenResponse = await oauth2Client.getToken(code);
  return tokenResponse.tokens;
}

async function getProfile(tokens) {
  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const me = await gmail.users.getProfile({ userId: "me" });
  return {
    emailAddress: me.data.emailAddress,
    historyId: me.data.historyId,
  };
}

function looksLikeQuoteMessage(messagePayload) {
  const headers = messagePayload?.headers || [];
  const subject = String(
    headers.find((h) => h.name?.toLowerCase() === "subject")?.value || ""
  ).toLowerCase();
  return QUOTE_KEYWORDS.some((kw) => subject.includes(kw));
}

function getHeaderValue(messagePayload, headerName) {
  const headers = messagePayload?.headers || [];
  return headers.find((h) => h.name?.toLowerCase() === headerName.toLowerCase())?.value || "";
}

function parseRecipientAddress(toHeader) {
  const raw = String(toHeader || "").trim();
  if (!raw) {
    return "";
  }
  const angleMatch = raw.match(/<([^>]+)>/);
  if (angleMatch) {
    return angleMatch[1].trim().toLowerCase();
  }
  return raw.split(",")[0].trim().toLowerCase();
}

function parseRecipientName(toHeader, fallbackEmail) {
  const raw = String(toHeader || "").trim();
  if (!raw) {
    return fallbackEmail;
  }
  const angleMatch = raw.match(/^(.+?)</);
  if (angleMatch) {
    return angleMatch[1].replace(/"/g, "").trim() || fallbackEmail;
  }
  return raw.split("@")[0];
}

function parseAmountFromSubject(subject) {
  const match = String(subject || "").match(/\$([0-9][0-9,]*(\.[0-9]{1,2})?)/);
  if (!match) {
    return 1000;
  }
  const normalized = match[1].replace(/,/g, "");
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : 1000;
}

async function syncQuotesFromSent({ tokens, maxResults = 20 }) {
  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const list = await gmail.users.messages.list({
    userId: "me",
    q: "in:sent newer_than:180d",
    maxResults,
  });

  const messageIds = list.data.messages || [];
  const parsed = [];
  for (const item of messageIds) {
    const message = await gmail.users.messages.get({
      userId: "me",
      id: item.id,
      format: "metadata",
      metadataHeaders: ["Subject", "To", "Date", "Message-Id"],
    });
    if (!looksLikeQuoteMessage(message.data.payload)) {
      continue;
    }
    const subject = getHeaderValue(message.data.payload, "Subject");
    const toHeader = getHeaderValue(message.data.payload, "To");
    const dateHeader = getHeaderValue(message.data.payload, "Date");
    const recipientEmail = parseRecipientAddress(toHeader);
    if (!recipientEmail) {
      continue;
    }
    const recipientName = parseRecipientName(toHeader, recipientEmail);
    const sentAt = new Date(dateHeader || Date.now()).toISOString();
    parsed.push({
      gmailMessageId: item.id,
      gmailThreadId: message.data.threadId,
      subject: subject || "Quote / Proposal",
      sentAt,
      recipientEmail,
      recipientName,
      amount: parseAmountFromSubject(subject),
    });
  }

  return parsed;
}

module.exports = {
  REDIRECT_PATH,
  hasGmailConfig,
  getMissingGmailConfigFields,
  buildAuthUrl,
  exchangeCodeForTokens,
  getProfile,
  syncQuotesFromSent,
};
