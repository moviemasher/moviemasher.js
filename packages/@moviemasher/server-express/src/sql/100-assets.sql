--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE `assets` (
  id STRING PRIMARY KEY,
  user_id STRING,
  label STRING,
  type STRING NOT NULL,
  source STRING NOT NULL,
  rest TEXT,
  created STRING,
  deleted STRING
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE `assets`;


--------------------------------------------------------------------------------
-- PostgreSQL
--------------------------------------------------------------------------------

-- CREATE TABLE IF NOT EXISTS assets (
--   id VARCHAR(255) PRIMARY KEY,
--   user_id VARCHAR(255) NOT NULL,
--   label VARCHAR(255),
--   type VARCHAR(255) DEFAULT '' NOT NULL,
--   source VARCHAR(255) DEFAULT '' NOT NULL,
--   rest JSONB,
--   created timestamp with time zone DEFAULT now(),
--   deleted timestamp with time zone
-- );

