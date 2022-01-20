--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE media (
  id STRING PRIMARY KEY,
  userId STRING,
  type STRING NOT NULL,
  url STRING NOT NULL,
  data TEXT,
  source STRING,
  label STRING,
  processing INTEGER,
  createdAt STRING NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE media;
