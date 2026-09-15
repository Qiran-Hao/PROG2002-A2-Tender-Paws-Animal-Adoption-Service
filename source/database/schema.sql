-- ============================================================
-- PROG2002 Web Development II - Charity Events website
-- A2 project: database schema
--
-- Database : charityevents_db
-- Tables   : charities, categories, events
-- Engine   : InnoDB (required for foreign keys)
--
-- Import order: run this file first, then seed.sql.
--   mysql -u root -p < source/database/schema.sql
--   mysql -u root -p < source/database/seed.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS charityevents_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE charityevents_db;

-- Dropped in child-to-parent order so the foreign keys never block a re-import.
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS charities;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- charities: the charity organisations that run the events
-- ------------------------------------------------------------
CREATE TABLE charities (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(150)  NOT NULL,
  slug        VARCHAR(150)  NOT NULL,
  focus       VARCHAR(150)  NOT NULL,
  email       VARCHAR(190)  NOT NULL,
  city        VARCHAR(120)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_charities_slug (slug)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- categories: the type of activity an event belongs to
--             (fun run, celebration, auction, clean-up ...)
-- ------------------------------------------------------------
CREATE TABLE categories (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(80)   NOT NULL,
  description VARCHAR(255)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- events: one row per charity event.
-- category_id -> categories.id and charity_id -> charities.id
-- are the two foreign keys that link the tables together.
-- ------------------------------------------------------------
CREATE TABLE events (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title        VARCHAR(180)  NOT NULL,
  category_id  INT UNSIGNED  NOT NULL,
  charity_id   INT UNSIGNED  NOT NULL,
  event_date   DATE          NOT NULL,
  location     VARCHAR(180)  NOT NULL,
  status       ENUM('upcoming', 'ongoing', 'suspended') NOT NULL DEFAULT 'upcoming',
  image        VARCHAR(120)  NOT NULL,
  description  TEXT          NOT NULL,
  purpose      TEXT          NOT NULL,
  price        VARCHAR(80)   NOT NULL,
  service_type VARCHAR(80)   NULL,
  PRIMARY KEY (id),
  KEY idx_events_category (category_id),
  KEY idx_events_charity (charity_id),
  KEY idx_events_date (event_date),
  KEY idx_events_status (status),
  CONSTRAINT fk_events_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_events_charity
    FOREIGN KEY (charity_id) REFERENCES charities (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
