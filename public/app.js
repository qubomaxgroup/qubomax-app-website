const state = {
  organizationId: null,
  organizations: [],
  leads: [],
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
  const stats = document.getElementById("stats");
  const items = [
    ["Total Quotes", metrics.totalQuotes],
    ["Pending", metrics.pendingQuotes],
    ["Replied", metrics.repliedQuotes],
    ["Won", metrics.wonQuotes],
    ["Lost", metrics.lostQuotes],
    ["Pipeline Value", formatCurrency(metrics.pipelineValue)],
    ["Won Value", formatCurrency(metrics.wonValue)],
    ["Overdue Follow-ups", metrics.overdueFollowups],
  ];
  stats.innerHTML = items
    .map(
      ([label, value]) => `
        <div class="card">
          <div class="card-title">${label}</div>
          <div class="card-value">${value}</div>
        </div>
      `
    )
    .join("");
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
      <td>${quote.sentFollowUpCount}</td>
      <td>${formatDate(quote.nextFollowUpAt)}</td>
      <td>${quoteActions(quote)}</td>
    `;
    tbody.appendChild(tr);
  }
}

async function ensureOrganization() {
  const payload = await request("/api/organizations");
  state.organizations = payload.organizations || [];
  if (state.organizations.length > 0) {
    state.organizationId = state.organizations[0].id;
    return;
  }
  const org = await request("/api/organizations", {
    method: "POST",
    body: JSON.stringify({ name: "My Business" }),
  });
  state.organizationId = org.id;
  state.organizations = [org];
}

async function loadLeads() {
  const payload = await request(`/api/leads?organizationId=${state.organizationId}`);
  state.leads = payload.leads || [];
  const select = document.getElementById("leadSelect");
  select.innerHTML = "";
  for (const lead of state.leads) {
    const option = document.createElement("option");
    option.value = lead.id;
    option.textContent = `${lead.name} (${lead.email})`;
    select.appendChild(option);
  }
}

async function loadDashboard() {
  const [dashboard, quotePayload] = await Promise.all([
    request(`/api/dashboard/${state.organizationId}`),
    request(`/api/quotes?organizationId=${state.organizationId}`),
  ]);
  state.quotes = quotePayload.quotes || [];
  renderSummary(dashboard.metrics);
  renderQuotes(state.quotes);
}

async function addLead(form) {
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();
  if (!name || !email) {
    throw new Error("Please provide lead name and email.");
  }
  await request("/api/leads", {
    method: "POST",
    body: JSON.stringify({
      organizationId: state.organizationId,
      name,
      email,
      company,
    }),
  });
}

function parseSequenceDays(raw) {
  if (!raw) {
    return [2, 5, 10];
  }
  const values = String(raw)
    .split(",")
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isInteger(item) && item > 0);
  return values.length > 0 ? values : [2, 5, 10];
}

async function addQuote(form) {
  const formData = new FormData(form);
  const leadId = String(formData.get("leadId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const amount = Number(formData.get("amount"));
  const followupDays = parseSequenceDays(formData.get("sequenceDays"));
  if (!leadId || !title || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Please provide a lead, title, and valid amount.");
  }
  await request("/api/quotes", {
    method: "POST",
    body: JSON.stringify({
      organizationId: state.organizationId,
      leadId,
      subject: title,
      amount,
      followupDays,
    }),
  });
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
  const leadForm = document.getElementById("leadForm");
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await addLead(leadForm);
      leadForm.reset();
      await loadLeads();
      setFeedback("Lead created.");
    } catch (error) {
      setFeedback(error.message, true);
    }
  });

  const quoteForm = document.getElementById("quoteForm");
  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await addQuote(quoteForm);
      quoteForm.reset();
      setFeedback("Quote created and follow-ups scheduled.");
      await loadDashboard();
    } catch (error) {
      setFeedback(error.message, true);
    }
  });

  document.getElementById("seedButton").addEventListener("click", async () => {
    try {
      const payload = await request("/api/seed", { method: "POST" });
      setFeedback(payload.message || "Demo data is ready.");
      await ensureOrganization();
      await loadLeads();
      await loadDashboard();
    } catch (error) {
      setFeedback(error.message, true);
    }
  });

  document.getElementById("runCycleButton").addEventListener("click", async () => {
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
  await loadLeads();
  wireEvents();
  await loadDashboard();
}

init().catch((error) => {
  setFeedback(error.message, true);
});
