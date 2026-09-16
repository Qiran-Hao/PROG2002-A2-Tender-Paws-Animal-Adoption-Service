-- ============================================================
-- PROG2002 Web Development II - Charity Events website
-- A2 project: B / A2-2  (Tender Paws - adoption theme)
-- Sample data for charityevents_db
--
-- Run schema.sql first, then this file.
--   mysql -u root -p < source/database/seed.sql
--
-- Contents: 4 categories, 3 charity organisations, 8 events.
-- service_type holds the extra service filter used on this site.
-- ============================================================

USE charityevents_db;

SET NAMES utf8mb4;

-- Cleared child-first so the foreign keys stay valid on a re-import.
DELETE FROM events;
DELETE FROM categories;
DELETE FROM charities;

-- ------------------------------------------------------------
-- categories
-- ------------------------------------------------------------
INSERT INTO categories (id, name, description) VALUES
  (1, 'Rescue', 'Street and wildlife rescue missions that bring animals to safety quickly.'),
  (2, 'Adoption', 'Meet-and-greet sessions that match rescued animals with lasting homes.'),
  (3, 'Shelter', 'Daily shelter care that keeps kennels clean, calm and comfortable.'),
  (4, 'Volunteer', 'Practical volunteer shifts that keep local rescue work moving.');

-- ------------------------------------------------------------
-- charities
-- ------------------------------------------------------------
INSERT INTO charities (id, name, slug, focus, email, city) VALUES
  (1, 'Tender Paws Rescue Network', 'tender-paws-rescue-network', 'Rescue', 'hello@tenderpawsrescue.org', 'Harbor'),
  (2, 'Tender Paws Adoption Centre', 'tender-paws-adoption-centre', 'Adoption', 'adopt@tenderpawsadoption.org', 'Northside'),
  (3, 'Tender Paws Foster Collective', 'tender-paws-foster-collective', 'Volunteer', 'foster@tenderpawsfoster.org', 'East District');

-- ------------------------------------------------------------
-- events
-- category_id references categories.id, charity_id references charities.id
-- ------------------------------------------------------------
INSERT INTO events
  (id, title, category_id, charity_id, event_date, location, status, image, description, purpose, price, service_type)
VALUES
  (1, 'Meet-and-Greet Adoption Hour', 2, 2, '2026-10-12', 'Tender Paws Adoption Room', 'upcoming', 'AC-01.jpg',
   'Meet ready-to-adopt animals and learn how to prepare a calm, safe home.',
   'Introduce adopters to the right animal so every match lasts.',
   'Free entry', 'adoption-guidance'),
  (2, 'Foster Care Orientation', 3, 3, '2026-10-19', 'Northside Shelter', 'upcoming', 'AC-02.jpg',
   'Understand short-term foster routines, supplies and the support available to carers.',
   'Prepare foster carers so animals rest in a home instead of a kennel.',
   'Free · donations welcome', 'foster-care'),
  (3, 'Adoption Guidance Clinic', 2, 2, '2026-11-02', 'Tender Paws Community Room', 'upcoming', 'AC-03.jpg',
   'Talk through matching, introductions and the first weeks after adoption.',
   'Guide families through the first weeks so adoptions are never returned.',
   'Free entry', 'adoption-guidance'),
  (4, 'Shelter Enrichment Workshop', 4, 3, '2026-11-09', 'East District Shelter', 'upcoming', 'AC-04.jpg',
   'Make enrichment toys and practise gentle play routines for shelter animals.',
   'Give shelter animals daily enrichment that keeps them ready for adoption.',
   'Suggested donation 50', 'shelter-shift'),
  (5, 'Emergency Dog Rescue Drill', 1, 1, '2026-11-21', 'Harbor Animal Clinic', 'upcoming', 'AC-05.jpg',
   'Practise safe capture, transport and first checks for dogs found in danger.',
   'Keep a trained rescue team ready for animals in immediate danger.',
   'Free entry', 'rescue-support'),
  (6, 'Stray Cat Triage Workshop', 1, 1, '2026-11-28', 'Tender Paws Community Room', 'upcoming', 'AC-06.jpg',
   'Learn quick health checks and route stray cats to the right care pathway.',
   'Move stray cats to the right care faster and reduce suffering.',
   'Free · donations welcome', 'rescue-support'),
  (7, 'Shelter Socialisation Shift', 3, 3, '2026-12-05', 'Northside Shelter', 'upcoming', 'AC-07.jpg',
   'Spend calm one-to-one time settling nervous animals into shelter routines.',
   'Help nervous animals trust people again before adoption day.',
   'Free entry', 'shelter-shift'),
  (8, 'Foster Family Meetup', 4, 3, '2026-12-12', 'Riverside Park', 'suspended', 'AC-08.jpg',
   'Meet other foster families, share practical tips and plan the next care round.',
   'Keep foster families connected so more animals can be cared for at home.',
   'Suggested donation 50', 'foster-care');
