const $ = (selector, root = document) => root.querySelector(selector);
const api = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Request failed");
  return response.json();
};
const escapeText = (value) => String(value ?? "");

/**
 * Service type is a SECOND dimension, separate from category.
 * Every entry keeps the raw slug (used in the ?serviceType= query param) and a
 * readable label for the interface.
 */
const SERVICE_TYPES = [
  {
    value: "rescue-support",
    label: "Rescue support",
    audience: "Trained responders, drivers and first-aiders who can travel at short notice.",
    audienceShort: "Trained responders",
    cadence: "On call through a rotating rota, with extra cover at weekends.",
    cadenceShort: "On-call rota",
    prepare: "Sturdy shoes, gloves, a charged phone and a clean carrier in the car.",
    booking: "Book a place so the crew knows who is on call."
  },
  {
    value: "foster-care",
    label: "Foster care",
    audience: "Households with a quiet spare room and a few hours free each day.",
    audienceShort: "Households with space",
    cadence: "Short-term placements that usually run for two to six weeks.",
    cadenceShort: "2-6 week placements",
    prepare: "A quiet room, washable bedding, food bowls and a secure carrier at home.",
    booking: "Book an orientation before your first placement."
  },
  {
    value: "adoption-guidance",
    label: "Adoption guidance",
    audience: "First-time adopters and families who are still deciding.",
    audienceShort: "First-time adopters",
    cadence: "A single 60-minute guidance session, with repeat visits welcome.",
    cadenceShort: "Single 60-minute session",
    prepare: "Proof of address, landlord pet permission and a plan for the first week.",
    booking: "Book a guidance slot before you meet an animal."
  },
  {
    value: "shelter-shift",
    label: "Shelter shift",
    audience: "Local volunteers who can commit to a regular weekly shift.",
    audienceShort: "Weekly volunteers",
    cadence: "Weekly three-hour shifts in the morning or the afternoon.",
    cadenceShort: "Weekly 3-hour shift",
    prepare: "Closed-toe shoes and clothes that can get muddy or hairy.",
    booking: "Book a shift so the shelter can plan the rota."
  }
];

const SERVICE_FALLBACK = {
  value: "",
  label: "Care service",
  audience: "Open to anyone who can offer time to the animals in our care.",
  audienceShort: "Open to everyone",
  cadence: "Check the service listing for the current schedule.",
  cadenceShort: "See schedule",
  prepare: "Contact the team if you are unsure what to bring.",
  booking: "Book through the service page."
};

/** Readable label for a service-type slug (e.g. foster-care -> "Foster care"). */
const serviceMeta = (value) => {
  const key = escapeText(value).toLowerCase();
  return SERVICE_TYPES.find((type) => type.value === key) || { ...SERVICE_FALLBACK, value: key };
};

const serviceLabel = (value) => serviceMeta(value).label;

const statusClass = (status) => {
  const key = escapeText(status).toLowerCase();
  return key === "upcoming" || key === "ongoing" || key === "suspended" ? `status-${key}` : "";
};

/**
 * THIS theme's card markup: a directory service card that foregrounds who the
 * service is for, how often it runs and how to book it.
 */
const card = (event) => {
  const meta = serviceMeta(event.serviceType);
  const booking =
    event.status === "suspended"
      ? "Registration paused"
      : `Booking open - ${escapeText(event.price)}`;
  const media = event.image
    ? `<img class="service-card-media" src="/assets/${encodeURIComponent(event.image)}" alt="Photograph for the service ${escapeText(event.title)}" width="800" height="500" loading="lazy">`
    : `<span class="media-fallback">Photograph not available</span>`;
  return `<article class="service-card">
        <div class="service-card-media-wrap">${media}</div>
        <div class="service-card-body">
          <p class="service-card-tags">
            <span class="service-tag">${escapeText(meta.label)}</span>
            <span class="status ${statusClass(event.status)}">${escapeText(event.status)}</span>
          </p>
          <h3 class="service-card-title">
            <a href="event.html?id=${encodeURIComponent(event.id)}">${escapeText(event.title)}</a>
          </h3>
          <p class="meta">${escapeText(event.category)} - ${escapeText(event.date)} - ${escapeText(event.location)}</p>
          <dl class="service-card-facts">
            <div class="fact">
              <dt>For</dt>
              <dd>${escapeText(meta.audienceShort)}</dd>
            </div>
            <div class="fact">
              <dt>Cadence</dt>
              <dd>${escapeText(meta.cadenceShort)}</dd>
            </div>
            <div class="fact">
              <dt>Booking</dt>
              <dd>${escapeText(booking)}</dd>
            </div>
          </dl>
          <a class="button secondary" href="event.html?id=${encodeURIComponent(event.id)}">View service</a>
        </div>
      </article>`;
};

/**
 * Render a readable loading / empty / error message into a region.
 * Passing an optional retry callback adds a Retry button for that region.
 */
const showState = (node, text, onRetry) => {
  if (!node) return;
  node.innerHTML = `<div class="state" role="status"><p class="state-text">${text}</p></div>`;
  if (typeof onRetry === "function") {
    const region = $(".state", node);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button";
    button.textContent = "Retry";
    button.addEventListener("click", onRetry);
    region.appendChild(button);
  }
};
