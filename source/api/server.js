const express = require('express');
const path = require('path');
const db = require('./event_db');

const app = express();
const port = Number(process.env.PORT || 3204);
const site = 'Tender Paws A2-2';

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

/**
 * Reads every response from the charityevents_db database through event_db.js.
 * A failed query is reported as JSON instead of quietly serving sample data,
 * so a misconfigured database is visible in the browser and in the console.
 */
const handle = (run) => async (req, res) => {
  try {
    await run(req, res);
  } catch (error) {
    console.error(`[${site}] database query failed:`, error.message);
    res.status(503).json({
      message:
        'Database unavailable. Import charityevents_db and check the connection settings in .env.',
      code: error.code || 'DB_UNAVAILABLE'
    });
  }
};

app.get(
  '/api/categories',
  handle(async (_req, res) => {
    const rows = await db.getCategoryNames();
    res.json(rows.map((row) => row.name));
  })
);

app.get(
  '/api/events',
  handle(async (req, res) => {
    res.json(await db.getAllEvents(String(req.query.category || '')));
  })
);

app.get(
  '/api/events/featured',
  handle(async (_req, res) => {
    res.json(await db.getFeaturedEvents());
  })
);

app.get(
  '/api/events/search',
  handle(async (req, res) => {
    res.json(
      await db.searchEvents({
        keyword: String(req.query.keyword || ''),
        date: String(req.query.date || ''),
        location: String(req.query.location || ''),
        category: String(req.query.category || ''),
        serviceType: String(req.query.serviceType || '')
      })
    );
  })
);

app.get(
  '/api/events/:id',
  handle(async (req, res) => {
    const event = await db.getEventById(Number(req.params.id));
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  })
);

app.get(
  '/api/organisations',
  handle(async (_req, res) => {
    res.json(await db.getOrganisations());
  })
);

app.get(
  '/api/organisations/:id',
  handle(async (req, res) => {
    const organisation = await db.getOrganisationById(Number(req.params.id));
    if (!organisation) return res.status(404).json({ message: 'Organisation not found' });
    res.json(organisation);
  })
);

app.use('/api', (_req, res) => res.status(404).json({ message: 'API route not found' }));

app.listen(port, () => console.log(`${site} listening on http://localhost:${port}`));
