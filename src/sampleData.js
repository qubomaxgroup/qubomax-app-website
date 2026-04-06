const { createOrganization, createLead, createQuoteThread } = require("./dataStore");
const { scheduleFollowUpsForQuote } = require("./followupEngine");

function seedIfEmpty(db) {
  if (db.organizations.length > 0 || db.quoteThreads.length > 0) {
    return false;
  }

  const org = createOrganization(db, "Demo Services Co");
  const leads = [
    {
      name: "Apex Roofing",
      email: "ops@apex-roofing.example",
      company: "Apex Roofing",
      subject: "Commercial roof patching - Building A",
      amount: 12500,
    },
    {
      name: "Bright Dental",
      email: "manager@brightdental.example",
      company: "Bright Dental",
      subject: "Website redesign and appointment landing page",
      amount: 3600,
    },
    {
      name: "Northline Electric",
      email: "admin@northline-electric.example",
      company: "Northline Electric",
      subject: "Warehouse lighting retrofit",
      amount: 8400,
    },
  ];

  for (const item of leads) {
    const lead = createLead(db, {
      organizationId: org.id,
      name: item.name,
      email: item.email,
      company: item.company,
    });
    const quote = createQuoteThread(db, {
      organizationId: org.id,
      leadId: lead.id,
      subject: item.subject,
      amount: item.amount,
      followupDays: [2, 5, 10],
    });
    scheduleFollowUpsForQuote(quote, [2, 5, 10]);
  }

  return true;
}

module.exports = {
  seedIfEmpty,
};
