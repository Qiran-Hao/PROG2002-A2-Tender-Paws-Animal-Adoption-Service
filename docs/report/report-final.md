# PROG2002 A2 Project Report

**Student:** Qiran Hao — 24832122
**Project:** Tender Paws — Adoption & Care Service Directory
**Unit:** PROG2002 Web Development II, Assignment 2

## Introduction / Motivation

Charity events such as gala dinners, fun runs, silent auctions and adoption days raise vital funds and awareness for a cause, yet many small and medium charity organisations still publish their events as static web pages or social-media posts. This makes it hard for potential attendees to discover what is happening, compare events, and understand who the event is for and how to take part. This project designs and builds a dynamic charity-events website that connects the Tender Paws animal rescue and adoption network with the public in its city.

The motivation for choosing the animal adoption and care theme is twofold. First, adoption and care services (rescue support, foster care, adoption guidance and shelter shifts) are recurring, date-specific activities that genuinely benefit from a searchable, database-driven directory rather than a fixed page. Second, the theme lets us exercise every concept required by the assignment: a relational database to store events, categories and organisations; RESTful APIs to serve that data; and a client-side website that consumes the APIs using modern JavaScript (fetch, Promises and DOM manipulation) without any front-end framework.

## Problem Statement

A static website cannot keep charity-event information accurate, current or easy to search:

- Event dates, venues, prices and status change frequently; hard-coding them in HTML makes the site quickly outdated and expensive to maintain.
- Attendees want to find events by date, location and category; without a structured data model and a search endpoint, no meaningful filtering is possible.
- Each event belongs to a charity organisation, and that relationship must be preserved so the site can show who runs each event.
- The charity must be able to mark an event as suspended so it no longer appears to the public, which requires the status to live in the database rather than in the page markup.

These point to a clear technical requirement: a MySQL relational database, a set of RESTful APIs that retrieve that data on demand, and a dynamic client-side website that renders it. The client and the server communicate over HTTP, which is exactly the client-server concept this unit covers.

## Solution

A three-tier web application: a MySQL database, a Node.js/Express REST API, and a client-side website built with standard HTML, CSS and vanilla JavaScript. The browser never talks to MySQL directly; it calls the API over HTTP using fetch, receives JSON, and renders the result into the DOM.

- **Server side:** `source/api/server.js` serves static client files and exposes read-only GET endpoints. Database access is isolated in `source/api/event_db.js`, which uses a connection pool to `charityevents_db` and runs every query with bound parameters (never string-concatenated SQL) to prevent SQL injection. Connection settings come from environment variables (`.env`).
- **Client side:** four pages (home, search, event details, registration placeholder) fetch content from the API and render it with DOM manipulation. Data flows: user action → fetch(API) returns a Promise → response JSON → DOM render. Suspended events are never returned by the search and featured endpoints.
- Event pages pass the selected event id using a URL query string (`event.html?id=4`) and fetch the full record from `GET /api/events/:id`.

## Web UX

A consistent, friendly visual system inspired by event-based fundraising and adoption sites: a warm colour palette, clear typography, rounded cards and a persistent navigation bar on every page. Usability is ensured through:

- Category tiles and service-type chips as two complementary ways to start browsing, plus a dynamically populated featured-services section.
- A search page with a filter rail combining service type, category, keyword, date and location, with a prominent "Clear filters" button.
- Feedback for every state: loading messages, friendly empty states, and clear error messages with a Retry button.
- Accessibility and responsiveness: skip-to-content link, aria labels, semantic HTML, image alt text, and adaptive layout. Animations disabled under `prefers-reduced-motion`.
- Progressive detail on the event page: who it suits, what to prepare, how often it runs, how to book, then full description and purpose.

## Data Schema

Three related tables model the case study (`charityevents_db`):

- **charities** — organisations that run events (name, slug, focus, email, city). PK: id.
- **categories** — event categories such as Rescue, Adoption, Shelter, Volunteer. PK: id.
- **events** — one row per event (title, event_date, location, status, image, description, purpose, price, service_type). PK: id; FK: category_id → categories.id, charity_id → charities.id.

The relationship is one-to-many: one charity runs many events, one category contains many events. Indexes on category_id, charity_id, event_date and status speed up the search and listing queries. Seed data: 4 categories, 3 charities and 8 events.

## API Design

Read-only GET endpoints:

- `GET /api/events` — list all events, optionally filtered by category.
- `GET /api/events/featured` — first three non-suspended events for the home page.
- `GET /api/events/search` — search by keyword, date, location, category, service_type.
- `GET /api/events/:id` — full detail for one event, including its charity and gallery.
- `GET /api/categories` — category names for the search dropdown.
- `GET /api/organisations` and `GET /api/organisations/:id` — organisation list and detail with its events.

**Example — `GET /api/events/search`.** Purpose: let the search page find events by combining optional criteria. It expects request query parameters (keyword, date, location, category, serviceType), each optional. The server builds a parameterised WHERE clause that only adds a condition for each supplied filter and always excludes suspended events, then returns a JSON array of matching events. If nothing matches, it returns an empty array and the page shows a friendly empty state.

**Choice of HTTP methods.** The A2 scope is read-only: users browse, search and view events, and registration/ticket purchase is deferred to Assessment 3. Every endpoint therefore uses GET, which is the correct semantic for safe, idempotent, cacheable retrieval. POST, PUT and DELETE are intentionally not implemented in A2 and will be added in Assessment 3 for registration and admin CRUD.

## Gen AI Acknowledgement

(Statement chosen in the submitted DOCX.)
