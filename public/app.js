const state = {
  organizationId: null,
  quotes: [],
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

function setFeedback(message, isError = false) {
  const el = document.getElementById("feedback");
  el.textContent = message;
  el.className = `feedback ${isError ? "error" : "success"}`;
}

function renderSummary(metrics) {
  document.getElementById("totalQuotes").textContent = metrics.totalQuotes;
  document.getElementById("pendingQuotes").textContent = metrics.pendingQuotes;
  document.getElementById("repliedQuotes").textContent = metrics.repliedQuotes;
  document.getElementById("wonQuotes").textContent = metrics.wonQuotes;
  document.getElementById("lostQuotes").textContent = metrics.lostQuotes;
  document.getElementById("pipelineValue").textContent = formatCurrency(metrics.pipelineValue);
  document.getElementById("wonValue").textContent = formatCurrency(metrics.wonValue);
  document.getElementById("overdueFollowups").textContent = metrics.overdueFollowups;
}

function quoteActions(quote) {
  if (quote.status !== "pending") {
    return "<span class='muted'>Closed</span>";
  }
  return `
    <button data-action="reply" data-id="${quote.id}">Replied</button>
    <button data-action="won" data-id="${quote.id}">Won</button>
    <button data-action="lost" data-id="${quote.id}">Lost</button>
  `;
}

function renderQuotes(quotes) {
  const tbody = document.getElementById("quoteRows");
  tbody.innerHTML = "";
  if (quotes.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="8" class="muted">No quotes yet.</td>`;
    tbody.appendChild(row);
    return;
  }
  for (const quote of quotes) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${quote.leadName}</td>
      <td>${quote.leadEmail}</td>
      <td>${quote.subject}</td>
      <td>${formatCurrency(quote.amount)}</td>
      <td><span class="status ${quote.status}">${quote.status}</span></td>
      <td>${formatDate(quote.lastFollowupAt)}</td>
      <td>${formatDate(quote.nextFollowupAt)}</td>
      <td>${quoteActions(quote)}</td>
    `;
    tbody.appendChild(tr);
  }
}

async function ensureOrganization() {
  const orgs = await request("/api/organizations");
  if (orgs.length > 0) {
    state.organizationId = orgs[0].id;
    return;
  }
  const org = await request("/api/organizations", {
    method: "POST",
    body: JSON.stringify({ name: "My Business" }),
  });
  state.organizationId = org.id;
}

async function loadDashboard() {
  const data = await request(`/api/dashboard/${state.organizationId}`);
  state.quotes = data.quotes;
  renderSummary(data.metrics);
  renderQuotes(data.quotes);
}

async function addQuote(form) {
  const formData = new FormData(form);
  const leadName = String(formData.get("leadName") || "").trim();
  const leadEmail = String(formData.get("leadEmail") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const amount = Number(formData.get("amount"));

  if (!leadName || !leadEmail || !company || !subject || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Please fill all fields with valid values.");
  }

  const lead = await request("/api/leads", {
    method: "POST",
    body: JSON.stringify({
      organizationId: state.organizationId,
      name: leadName,
      email: leadEmail,
      company,
    }),
  });

  await request("/api/quotes", {
    method: "POST",
    body: JSON.stringify({
      organizationId: state.organizationId,
      leadId: lead.id,
      subject,
      amount,
      followupDays: [2, 5, 10],
    }),
  });
}

async function runScheduler() {
  await request("/api/followups/run", { method: "POST" });
}

async function updateQuoteStatus(id, action) {
  const routeMap = {
    reply: "reply",
    won: "won",
    lost: "lost",
  };
  const route = routeMap[action];
  if (!route) {
    return;
  }
  await request(`/api/quotes/${id}/${route}`, { method: "POST" });
}

function wireEvents() {
  const form = document.getElementById("newQuoteForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await addQuote(form);
      form.reset();
      setFeedback("Quote created and follow-ups scheduled.");
      await loadDashboard();
    } catch (error) {
      setFeedback(error.message, true);
    }
  });

  document.getElementById("seedButton").addEventListener("click", async () => {
    try {
      await request("/api/seed", { method: "POST" });
      setFeedback("Seed data added.");
      await loadDashboard();
    } catch (error) {
      setFeedback(error.message, true);
    }
  });

  document.getElementById("runSchedulerButton").addEventListener("click", async () => {
    try {
      const payload = await request("/api/followups/run", { method: "POST" });
      setFeedback(`Scheduler processed ${payload.processed} follow-ups.`);
      await loadDashboard();
    } catch (error) {
      setFeedback(error.message, true);
    }
  });

  document.getElementById("quoteRows").addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const id = target.getAttribute("data-id");
    const action = target.getAttribute("data-action");
    if (!id || !action) {
      return;
    }
    try {
      await updateQuoteStatus(id, action);
      setFeedback(`Quote marked as ${action}.`);
      await loadDashboard();
    } catch (error) {
      setFeedback(error.message, true);
    }
  });
}

async function init() {
  await ensureOrganization();
  wireEvents();
  await loadDashboard();
}

init().catch((error) => {
  setFeedback(error.message, true);
});
