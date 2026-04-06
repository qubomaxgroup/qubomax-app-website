const test = require("node:test");
const assert = require("node:assert/strict");
const {
  computeFollowUpDates,
  scheduleFollowUps,
  cancelPendingFollowUps,
  runDueFollowUps,
  toSummary,
} = require("../src/followupEngine");

test("compute follow-up dates based on sent timestamp", () => {
  const dates = computeFollowUpDates("2026-04-01T00:00:00.000Z", [2, 5, 10]);
  assert.equal(dates[0], "2026-04-03T00:00:00.000Z");
  assert.equal(dates[1], "2026-04-06T00:00:00.000Z");
  assert.equal(dates[2], "2026-04-11T00:00:00.000Z");
});

test("schedule and cancel follow-ups for replied quotes", () => {
  const quote = {
    id: "q_1",
    leadName: "Acme",
    subject: "Kitchen Remodel",
    sentAt: "2026-04-01T00:00:00.000Z",
    followUps: [],
  };
  scheduleFollowUps(quote, [2, 5]);
  assert.equal(quote.followUps.length, 2);
  assert.equal(quote.followUps[0].status, "pending");
  const cancelled = cancelPendingFollowUps(quote);
  assert.equal(cancelled, 2);
  assert.equal(quote.followUps[0].status, "cancelled");
});

test("runDueFollowUps sends only due pending items", () => {
  const quote = {
    id: "q_2",
    leadEmail: "ops@example.com",
    leadName: "Ops",
    subject: "Quote",
    status: "pending",
    sentAt: "2026-04-01T00:00:00.000Z",
    followUps: [],
  };
  scheduleFollowUps(quote, [2, 5]);

  const events = runDueFollowUps([quote], "2026-04-03T00:00:00.000Z");
  assert.equal(events.length, 1);
  assert.equal(quote.followUps[0].status, "sent");
  assert.equal(quote.followUps[1].status, "pending");
});

test("toSummary derives next and last follow-up timestamps", () => {
  const db = {
    leads: [{ id: "lead_1", name: "Lead", email: "lead@example.com" }],
  };
  const quote = {
    id: "q_3",
    organizationId: "org_1",
    leadId: "lead_1",
    subject: "Maintenance Plan",
    amount: 1200,
    sentAt: "2026-04-01T00:00:00.000Z",
    status: "pending",
    followUps: [
      {
        id: "f1",
        stepNumber: 1,
        scheduledAt: "2026-04-03T00:00:00.000Z",
        status: "sent",
        sentAt: "2026-04-03T10:00:00.000Z",
      },
      {
        id: "f2",
        stepNumber: 2,
        scheduledAt: "2026-04-06T00:00:00.000Z",
        status: "pending",
        sentAt: null,
      },
    ],
  };
  const summary = toSummary(quote, db);
  assert.equal(summary.lastFollowUpAt, "2026-04-03T10:00:00.000Z");
  assert.equal(summary.nextFollowUpAt, "2026-04-06T00:00:00.000Z");
});
