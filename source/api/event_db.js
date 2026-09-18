'use strict';

/**
 * PROG2002 Web Development II - A2 project
 * event_db.js - the Node.js connection file for the charityevents_db database.
 *
 * Connection details come from environment variables so that no real password
 * is stored in the code (copy .env.example to .env and fill in your settings).
 *
 * Every statement in this file is parameterised: request values are always sent
 * as bound parameters, never concatenated into the SQL text.
 */

require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'charityevents_db',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  // DATE columns are returned as 'YYYY-MM-DD' strings, which is the format the
  // pages display and compare against.
  dateStrings: true
});

const EVENT_COLUMNS = `
  e.id,
  e.title,
  c.name AS category,
  e.charity_id AS organisationId,
  e.event_date AS date,
  e.location,
  e.status,
  e.image,
  e.description,
  e.purpose,
  e.price,
  e.service_type AS serviceType
`;

const EVENT_FROM = `
  FROM events e
  JOIN categories c ON c.id = e.category_id
`;

async function select(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/** Category names, used to build the search dropdown. */
function getCategoryNames() {
  return select('SELECT name FROM categories ORDER BY id');
}

/** Full category records, including the description shown on the website. */
function getCategories() {
  return select('SELECT id, name, description FROM categories ORDER BY id');
}

/** All events, optionally narrowed to a single category. */
function getAllEvents(category) {
  if (!category) return select(`SELECT ${EVENT_COLUMNS} ${EVENT_FROM} ORDER BY e.id`);
  return select(`SELECT ${EVENT_COLUMNS} ${EVENT_FROM} WHERE c.name = ? ORDER BY e.id`, [category]);
}

/** The first three events that are still running; suspended events are excluded. */
function getFeaturedEvents() {
  return select(
    `SELECT ${EVENT_COLUMNS} ${EVENT_FROM} WHERE e.status <> 'suspended' ORDER BY e.id LIMIT 3`
  );
}

/**
 * Search events. Every supplied filter is added as an AND condition, so the
 * caller can combine keyword, date, location, category and service type.
 * Suspended events are never returned.
 */
function searchEvents({ keyword, date, location, category, serviceType } = {}) {
  const conditions = ["e.status <> 'suspended'"];
  const params = [];

  if (keyword) {
    conditions.push('LOWER(e.title) LIKE ?');
    params.push(`%${keyword.toLowerCase()}%`);
  }
  if (date) {
    conditions.push('e.event_date = ?');
    params.push(date);
  }
  if (location) {
    conditions.push('LOWER(e.location) LIKE ?');
    params.push(`%${location.toLowerCase()}%`);
  }
  if (category) {
    conditions.push('c.name = ?');
    params.push(category);
  }
  if (serviceType) {
    conditions.push('e.service_type = ?');
    params.push(serviceType);
  }

  return select(
    `SELECT ${EVENT_COLUMNS} ${EVENT_FROM} WHERE ${conditions.join(' AND ')} ORDER BY e.id`,
    params
  );
}

/**
 * One event with its charity name and a small gallery taken from the other
 * events run by the same charity. Returns null when the id does not exist.
 */
async function getEventById(id) {
  if (!Number.isInteger(id)) return null;

  const [event] = await select(
    `SELECT ${EVENT_COLUMNS}, ch.name AS organisation, ch.email AS organisationEmail
     ${EVENT_FROM}
     JOIN charities ch ON ch.id = e.charity_id
     WHERE e.id = ?`,
    [id]
  );
  if (!event) return null;

  const others = await select(
    'SELECT image FROM events WHERE charity_id = ? AND id <> ? ORDER BY id LIMIT 1',
    [event.organisationId, event.id]
  );

  return { ...event, gallery: [event.image, ...others.map((row) => row.image)] };
}

/** All charity organisations. */
function getOrganisations() {
  return select('SELECT id, name, slug, focus, email, city FROM charities ORDER BY id');
}

/** One charity organisation together with the events it runs. */
async function getOrganisationById(id) {
  if (!Number.isInteger(id)) return null;

  const [organisation] = await select(
    'SELECT id, name, slug, focus, email, city FROM charities WHERE id = ?',
    [id]
  );
  if (!organisation) return null;

  const events = await select(
    `SELECT ${EVENT_COLUMNS} ${EVENT_FROM} WHERE e.charity_id = ? ORDER BY e.id`,
    [id]
  );

  return { ...organisation, events };
}

module.exports = {
  pool,
  getCategories,
  getCategoryNames,
  getAllEvents,
  getFeaturedEvents,
  searchEvents,
  getEventById,
  getOrganisations,
  getOrganisationById
};
