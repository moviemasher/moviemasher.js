--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE `definition` (
  id STRING PRIMARY KEY,
  userId STRING,
  icon TEXT,
  label STRING,
  json TEXT,
  type STRING NOT NULL,
  processing INTEGER,
  createdAt STRING NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE `definition`;
