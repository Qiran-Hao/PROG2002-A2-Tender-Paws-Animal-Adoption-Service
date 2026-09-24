/* ==========================================================================
   Tender Paws A2-2 — search page: filter rail + horizontal result cards
   Service type is submitted as the raw slug through the serviceType param.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = $("#search-form");
  const results = $("#results");
  const count = $("#result-count");
  if (!form || !results || !count) return;

  const categorySelect = form.elements["category"];
  const params = new URLSearchParams(location.search);

  const renderRow = (event) => {
    const meta = serviceMeta(event.serviceType);
    const booking =
      event.status === "suspended"
        ? "Registration paused"
        : `Book ahead - ${escapeText(event.price)}`;
    const media = event.image
      ? `<img src="/assets/${encodeURIComponent(event.image)}" alt="Photograph for the service ${escapeText(event.title)}" width="600" height="450" loading="lazy">`
      : `<span class="media-fallback">Photograph not available</span>`;
    return `<article class="service-card-h">
            <div class="service-card-h-media">${media}</div>
            <div class="service-card-h-body">
              <div class="service-card-h-head">
                <span class="service-tag">${escapeText(meta.label)}</span>
                <time datetime="${escapeText(event.date)}">${escapeText(event.date)}</time>
              </div>
              <h3 class="service-card-h-title">
                <a href="event.html?id=${encodeURIComponent(event.id)}">${escapeText(event.title)}</a>
              </h3>
              <p class="meta">${escapeText(event.category)} - ${escapeText(event.location)}</p>
              <p class="meta">For ${escapeText(meta.audienceShort)} - ${escapeText(meta.cadenceShort)}</p>
              <p class="meta">${escapeText(booking)}</p>
              <a class="button secondary" href="event.html?id=${encodeURIComponent(event.id)}">View this service</a>
            </div>
          </article>`;
  };

  const renderEmpty = () => {
    results.innerHTML = `<div class="empty">
          <p>
            No services match these filters. Try choosing a different service type, widening the
            category, or clearing the filters to see everything.
          </p>
        </div>`;
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "button secondary";
    reset.textContent = "Show all services";
    reset.addEventListener("click", () => form.reset());
    $(".empty", results).appendChild(reset);
  };

  const readFilters = () => {
    const values = new URLSearchParams(new FormData(form));
    [...values.keys()].forEach((key) => {
      if (!values.get(key)) values.delete(key);
    });
    return values;
  };

  const load = async () => {
    const filters = readFilters();
    showState(results, "Loading services…");
    count.textContent = "Searching…";
    try {
      const events = await api(`/api/events/search?${filters.toString()}`);
      count.textContent =
        events.length === 1 ? "1 service found" : `${events.length} services found`;
      history.replaceState(null, "", `search.html?${filters.toString()}`);
      if (events.length === 0) {
        renderEmpty();
        return;
      }
      results.innerHTML = events.map(renderRow).join("");
    } catch {
      count.textContent = "Search unavailable";
      showState(
        results,
        "Search is unavailable right now because the service directory could not be reached. Your filters are kept, so you can try again.",
        load
      );
    }
  };

  const init = async () => {
    if (categorySelect) {
      try {
        const categories = await api("/api/categories");
        if (Array.isArray(categories) && categories.length) {
          const current = categorySelect.value;
          categorySelect.innerHTML =
            '<option value="">Any category</option>' +
            categories
              .map((name) => `<option value="${escapeText(name)}">${escapeText(name)}</option>`)
              .join("");
          categorySelect.value = current;
        }
      } catch {
        /* keep the category options already written into the markup */
      }
    }

    ["keyword", "date", "location", "category", "serviceType"].forEach((name) => {
      const control = form.elements[name];
      if (control && params.get(name)) control.value = params.get(name);
    });

    load();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    load();
  });

  form.addEventListener("reset", () => window.setTimeout(load, 0));

  init();
});
