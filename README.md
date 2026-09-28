# Tender Paws — Adoption & Care Service Directory

A dynamic charity-events website built for **PROG2002 Web Development II (Assignment 2)**.
This project connects the **Tender Paws** animal rescue and adoption network with the
public in its city, letting people browse, search and view charity events (rescue
support, foster care, adoption guidance and shelter shifts) and prepare to take part.

Built with the exact stack required by the unit: **Node.js, Express, MySQL, HTML,
CSS and vanilla JavaScript (DOM + Promises)** — no front-end framework.

---

## Live pages

| Page | Route | Purpose |
| --- | --- | --- |
| Home | `/index.html` | Charity overview, category tiles, service-type chips and a featured-services list loaded from the API |
| Search | `/search.html` | Filter events by service type, category, keyword, date and location |
| Event details | `/event.html?id={id}` | Full detail for one selected event, its charity and a small gallery |
| Registration | `/registration-placeholder.html?id={id}` | Readiness preview; full sign-up is completed in Assessment 3 |

---

## Tech stack

- **Backend:** Node.js + Express 4, `mysql2` (connection pool, parameterised queries), `dotenv`
- **Frontend:** standard HTML5, CSS and vanilla JavaScript (`fetch` + Promises + DOM)
- **Database:** MySQL 8, database `charityevents_db`
- **No front-end framework, no template engine, no third-party runtime library** (as required for A2)

---

## Project structure

```text
A2-2/
├─ .env.example                 # Connection template (copy to .env, never commit)
├─ package.json
├─ PAGES.md                     # Page-by-page functional spec
├─ RESOURCES.md                 # Asset, colour, font and data dimension spec
└─ source/
   ├─ client/                   # Front-end
   │  ├─ index.html
   │  ├─ search.html
   │  ├─ event.html
   │  ├─ registration-placeholder.html
   │  ├─ css/                   # styles, home, search, event, theme
   │  └─ js/                    # app.js (shared) + page scripts
   ├─ api/
   │  ├─ server.js              # Express server, static files + REST routes
   │  └─ event_db.js            # MySQL connection pool + parameterised queries
   ├─ database/
   │  ├─ schema.sql             # Database + tables + keys + indexes
   │  ├─ seed.sql               # 4 categories, 3 charities, 8 events
   │  └─ README.md              # Import / connection guide
   └─ assets/                   # Images, logo, favicon, OG image
```

---

## Database design

Three related tables model the case study (`charityevents_db`):

```text
charities (1) ──┐
                ├──< events >──┐
categories (1) ─┘              │
                               └─ category_id → categories.id
                                  charity_id  → charities.id
```

- `charities` — organisations that run events (name, slug, focus, email, city).
- `categories` — event categories such as Rescue, Adoption, Shelter, Volunteer.
- `events` — one row per event (title, date, location, status, image, description,
  purpose, price, service_type), with foreign keys to `categories` and `charities`.

Indexes on `category_id`, `charity_id`, `event_date` and `status` speed up the
search and listing queries. `status` (`upcoming` / `ongoing` / `suspended`) lets
the charity hide suspended events from public pages.

---

## REST API

Read-only `GET` endpoints (registration/admin CRUD is deferred to Assessment 3):

| Endpoint | Purpose |
| --- | --- |
| `GET /api/events` | List all events, optionally filtered by `?category=` |
| `GET /api/events/featured` | First three non-suspended events for the home page |
| `GET /api/events/search` | Search by `keyword`, `date`, `location`, `category`, `serviceType` |
| `GET /api/events/:id` | Full detail for one event + its charity + gallery |
| `GET /api/categories` | Category names for the search dropdown |
| `GET /api/organisations` | All charity organisations |
| `GET /api/organisations/:id` | One organisation + its events |

All queries use **bound parameters** (no string-concatenated SQL) to prevent SQL
injection, and failures return a JSON `503` instead of silently serving sample data.

---

## Setup & run

1. **Create the database** (MySQL must be running):

   ```bash
   mysql -u root -p < source/database/schema.sql
   mysql -u root -p < source/database/seed.sql
   ```

2. **Configure connection** — copy `.env.example` to `.env` and fill in your MySQL user and password.

3. **Install dependencies and start:**

   ```bash
   npm install
   npm start
   ```

4. Open `http://localhost:3204/` in a browser.

> Each A2 project uses its own port; this project defaults to **3204**.

---

## Work progress on GitHub

This repository documents the project's development across stages — database
design, API development, client-side implementation, and the written report — with
regular commits that show the work progressing toward final submission.
