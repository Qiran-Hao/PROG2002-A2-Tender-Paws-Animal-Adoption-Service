/* ==========================================================================
   Tender Paws A2-2 — registration placeholder page
   Shows a "Before you book" preparation summary for the chosen service.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const summary = $("#registration-summary");
  if (!summary) return;

  const id = new URLSearchParams(location.search).get("id");

  const renderSummary = (event) => {
    const meta = serviceMeta(event.serviceType);
    const closed = event.status === "suspended";
    const facts = [
      ["Service type", meta.label],
      ["Category", escapeText(event.category)],
      ["Date", escapeText(event.date)],
      ["Location", escapeText(event.location)],
      ["Cost", escapeText(event.price)],
      ["Status", escapeText(event.status)]
    ]
      .map(
        ([label, value]) =>
          `<div class="fact"><dt>${label}</dt><dd>${value}</dd></div>`
      )
      .join("");
    summary.innerHTML = `<h2>You are preparing to book</h2>
        <p class="summary-service">${escapeText(event.title)}</p>
        <dl class="prep-facts">${facts}</dl>
        <p class="prep-cadence">${escapeText(meta.cadence)}</p>
        <p class="prep-readiness">${escapeText(meta.audience)}</p>
        <p class="prep-actions">
          <a class="button secondary" href="event.html?id=${encodeURIComponent(event.id)}">Back to the service</a>
        </p>
        ${
          closed
            ? `<p class="notice" role="status">This service is suspended, so booking is closed for now. You can still read the preparation notes below.</p>`
            : ""
        }`;
  };

  const renderFallback = (canRetry) => {
    summary.innerHTML = `<h2>Prepare for any service</h2>
        <p>We could not load the service you picked, but the preparation steps below apply to every Tender Paws booking.</p>
        <p class="prep-actions">
          <a class="button secondary" href="search.html">Choose a service</a>
        </p>`;
    if (canRetry) {
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "button";
      retry.textContent = "Retry";
      retry.addEventListener("click", load);
      $(".prep-actions", summary).appendChild(retry);
    }
  };

  const load = async () => {
    if (!id) {
      renderFallback(false);
      return;
    }
    summary.innerHTML = '<p class="state" role="status">Loading the service summary…</p>';
    try {
      const event = await api(`/api/events/${encodeURIComponent(id)}`);
      renderSummary(event);
    } catch {
      renderFallback(true);
    }
  };

  load();
});
