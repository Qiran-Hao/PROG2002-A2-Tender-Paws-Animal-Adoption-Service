# Database files - Charity Events website

PROG2002 Web Development II, A2 project.
Database name: **`charityevents_db`**

## Files

| File | Purpose |
| --- | --- |
| `schema.sql` | Creates the `charityevents_db` database, the `charities`, `categories` and `events` tables, the primary keys, the two foreign keys and the search indexes. |
| `seed.sql` | Inserts the sample data for this project: the categories, the charity organisations and at least 8 events. |

## Table relationship

```text
charities (1) ──┐
                ├──< events >──┐
categories (1) ─┘              │
                               └─ category_id → categories.id
                                  charity_id  → charities.id
```

`events` is the child table. Its two foreign keys (`fk_events_category`,
`fk_events_charity`) reference the parent tables, so an event can never point at
a category or charity that does not exist.

## Importing the data

Import `schema.sql` first and `seed.sql` second.

```bash
mysql -u root -p < source/database/schema.sql
mysql -u root -p < source/database/seed.sql
```

In MySQL Workbench: open `schema.sql`, run the whole script, then open
`seed.sql` and run it.

Both scripts are safe to run again: `schema.sql` drops the tables in
child-to-parent order before recreating them, and `seed.sql` clears the three
tables before inserting the sample rows.

## Connecting the Node.js server

1. Copy `.env.example` (in the project root) to `.env`.
2. Fill in your MySQL user name and password.
3. Install the dependencies and start the server:

```bash
npm install
npm start
```

`source/api/event_db.js` reads the connection settings from the environment
variables listed in `.env.example` and creates the connection pool used by
`source/api/server.js`. No password is stored in the source code.

If the database is not reachable, the API answers with a JSON `503` message
instead of returning sample data, and the server keeps serving the pages so the
error is visible rather than silent.

## Note on the database name

This file set uses the database name required by the assignment,
`charityevents_db`. Because every A2 project uses the same name, importing two
projects into one MySQL server would overwrite each other's data. Import one
project per MySQL server, or change `DB_NAME` and the name in `schema.sql` if
you need to run several of them side by side.
