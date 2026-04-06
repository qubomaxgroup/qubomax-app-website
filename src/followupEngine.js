const crypto = require("node:crypto");

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_SEQUENCE_DAYS = [2, 5, 10];

function normalizeSchedule(scheduleDays = DEFAULT_SEQUENCE_DAYS) {
  if (!Array.isArray(scheduleDays)) {
    return [...DEFAULT_SEQUENCE_DAYS];
  }
  const normalized = [...new Set(
    scheduleDays
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isInteger(value) && value > 0)
  )].sort((a, b) => a - b);
  return normalized.length > 0 ? normalized : [...DEFAULT_SEQUENCE_DAYS];
}

function computeFollowUpDates(sentAt, scheduleDays = DEFAULT_SEQUENCE_DAYS) {
  const sentAtMs = new Date(sentAt).getTime();
  const normalized = normalizeSchedule(scheduleDays);
  return normalized.map((day) => new Date(sentAtMs + day * DAY_MS).toISOString());
}

function scheduleFollowUps(quote, explicitScheduleDays) {
  const scheduleDays = explicitScheduleDays || quote.followupDays || DEFAULT_SEQUENCE_DAYS;
  const dates = computeFollowUpDates(quote.sentAt, scheduleDays);
  quote.followUps = dates.map((scheduledAt, index) => ({
    id: crypto.randomUUID(),
    stepNumber: index + 1,
    scheduledAt,
    status: "pending",
    sentAt: null,
    body: buildFollowUpBody(quote, index + 1),
  }));
  return quote.followUps;
}

function buildFollowUpBody(quote, stepNumber) {
  const title = quote.subject;
  const name = quote.leadName;
  if (stepNumber === 1) {
    return `Hi ${name}, just checking if you have any questions about "${title}".`;
  }
  if (stepNumber === 2) {
    return `Hi ${name}, following up on "${title}" in case you want to move forward this week.`;
  }
  return `Hi ${name}, final follow-up on "${title}". Happy to reserve the current pricing for you.`;
}

function shouldStopFollowUps(status) {
  return ["replied", "won", "lost"].includes(status);
}

function cancelPendingFollowUps(quote) {
  const followUps = Array.isArray(quote) ? quote : quote.followUps;
  if (!Array.isArray(followUps)) {
    return 0;
  }
  let cancelled = 0;
  for (const item of followUps) {
    if (item.status === "pending") {
      item.status = "cancelled";
      cancelled += 1;
    }
  }
  return cancelled;
}

function runDueFollowUps(quotes, runAt = new Date().toISOString()) {
  const now = new Date(runAt).getTime();
  const events = [];

  for (const quote of quotes) {
    if (shouldStopFollowUps(quote.status)) {
      continue;
    }
    for (const item of quote.followUps) {
      if (item.status !== "pending") {
        continue;
      }
      if (new Date(item.scheduledAt).getTime() <= now) {
        item.status = "sent";
        item.sentAt = runAt;
        events.push({
          quoteId: quote.id,
          stepNumber: item.stepNumber,
          sentAt: runAt,
          leadEmail: quote.leadEmail,
        });
      }
    }
  }

  return events;
}

function summarizeQuote(quote) {
  const sentFollowUps = quote.followUps.filter((item) => item.status === "sent");
  const pendingFollowUps = quote.followUps.filter((item) => item.status === "pending");
  const nextFollowUp = [...pendingFollowUps].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
  const lastSent = [...sentFollowUps].sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];

  return {
    id: quote.id,
    organizationId: quote.organizationId,
    leadId: quote.leadId,
    leadName: quote.leadName,
    leadEmail: quote.leadEmail,
    subject: quote.subject,
    amount: quote.amount,
    status: quote.status,
    sentAt: quote.sentAt,
    followupDays: quote.followupDays,
    sentFollowUpCount: sentFollowUps.length,
    pendingFollowUpCount: pendingFollowUps.length,
    lastFollowUpAt: lastSent ? lastSent.sentAt : null,
    nextFollowUpAt: nextFollowUp ? nextFollowUp.scheduledAt : null,
  };
}

function toSummary(quote, db) {
  const lead = db.leads.find((item) => item.id === quote.leadId);
  return summarizeQuote({
    ...quote,
    leadName: lead ? lead.name : "Unknown",
    leadEmail: lead ? lead.email : "unknown@example.com",
  });
}

module.exports = {
  DEFAULT_SEQUENCE_DAYS,
  normalizeSchedule,
  computeFollowUpDates,
  scheduleFollowUps,
  shouldStopFollowUps,
  cancelPendingFollowUps,
  runDueFollowUps,
  summarizeQuote,
  toSummary,
};
