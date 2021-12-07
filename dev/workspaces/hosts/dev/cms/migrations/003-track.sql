--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE track (
  id STRING PRIMARY KEY,
  mashId STRING NOT NULL,
  userId STRING NOT NULL,
  trackType STRING NOT NULL,
  data TEXT,
  layer INTEGER NOT NULL,
  dense INTEGER NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE track;
