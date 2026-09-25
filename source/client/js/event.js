/* ==========================================================================
   Tender Paws A2-2 — event detail page
   First screen foregrounds who it suits, what to prepare, care frequency and
   how to book. The photograph sits beside that information, not over it.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = $("#event-detail");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");

  const detail = (event) => {
    const meta = serviceMeta(event.serviceType);
    const suspended = event.status === "suspended";
    const galleryNames = [...new Set((event.gallery || []).filter(Boolean))];

    const media = event.image
      ? `<img src="/assets/${encodeURIComponent(event.image)}" alt="Photograph for the service ${escapeText(event.title)}" width="1200" height="900" loading="lazy">`
      : `<span class="media-fallback">Photograph not available</span>`;

    const facts = [
      ["Date", event.date],
      ["Location", event.location],
      ["Category", event.category],
      ["Service type", meta.label],
      ["Cost", event.price],
      ["Status", event.status]
    ];
    if (event.organisation) facts.push(["Organisation", event.organisation]);
    const factRows = facts
      .map(
        ([label, value]) =>
          `<div class="fact"><dt>${escapeText(label)}</dt><dd>${escapeText(value)}</dd></div>`
      )
      .join("");

    const gallery =
      galleryNames.length > 1
        ? `<div class="event-gallery">
            ${galleryNames
              .slice(0, 6)
              .map(
                (name) =>
                  `<div class="gallery-thumb"><img src="/assets/${encodeURIComponent(name)}" alt="Further view of ${escapeText(event.title)}" width="400" height="300" loading="lazy"></div>`
              )
              .join("")}
          </div>`
        : "";

    const bookingPanel = suspended
      ? `<p>Registration is closed while this service is suspended. You can still read the preparation notes.</p>
         <p class="suits-foot">Status: ${escapeText(event.status)}</p>`
      : `<p>${escapeText(meta.booking)}</p>
         <p class="suits-foot">Cost: ${escapeText(event.price)}</p>`;

    const cta = suspended
      ? `<span class="button" aria-disabled="true">Request this service</span>
         <p class="notice" role="status">This service is not open for registration at the moment.</p>`
      : `<a class="button" href="registration-placeholder.html?id=${encodeURIComponent(event.id)}">Request this service</a>
         <p class="meta">Registration opens in the next stage of the project; you will see the preparation steps first.</p>`;

    return `<div class="event-head">
        <p class="event-tags">
          <span class="service-tag">${escapeText(meta.label)}</span>
          <span class="status ${statusClass(event.status)}">${escapeText(event.status)}</span>
          <span class="status">${escapeText(event.category)}</span>
        </p>
        <h1>${escapeText(event.title)}</h1>
        <p class="event-meta">${escapeText(event.date)} - ${escapeText(event.location)} - ${escapeText(event.price)}</p>
      </div>

      <div class="event-lead">
        <div class="suits-grid">
          <article class="suits-panel">
            <h2>Who it suits</h2>
            <p>${escapeText(meta.audience)}</p>
            <p class="suits-foot">Category: ${escapeText(event.category)}</p>
          </article>
          <article class="suits-panel">
            <h2>What to prepare</h2>
            <p>${escapeText(meta.prepare)}</p>
          </article>
          <article class="suits-panel">
            <h2>Care frequency</h2>
            <p>${escapeText(meta.cadence)}</p>
            <p class="suits-foot">Next session: ${escapeText(event.date)}</p>
          </article>
          <article class="suits-panel">
            <h2>How to book</h2>
            ${bookingPanel}
          </article>
        </div>

        <aside class="event-aside">
          <div class="event-media">${media}</div>
          <div class="event-facts">
            <h2>Service facts</h2>
            ${factRows}
          </div>
        </aside>
      </div>

      <div class="event-body">
        <section>
          <h2>About this service</h2>
          <p>${escapeText(event.description)}</p>
        </section>
        <section>
          <h2>Charitable purpose</h2>
          <p>${escapeText(event.purpose)}</p>
        </section>
      </div>

      <div class="event-cta">${cta}</div>

      ${gallery}`;
  };

  const load = async () => {
    if (!id) {
      showState(
        root,
        "No service was selected. Go back to the directory and choose a service to see its details."
      );
      return;
    }
    showState(root, "Loading service details…");
    try {
      const event = await api(`/api/events/${encodeURIComponent(id)}`);
      root.innerHTML = detail(event);
    } catch {
      showState(
        root,
        "This service could not be loaded. It may no longer be listed, or the directory database may be offline.",
        load
      );
    }
  };

  load();
});
