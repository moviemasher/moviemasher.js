--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE clip (
  id STRING PRIMARY KEY NOT NULL,
  definitionId STRING NOT NULL,
  type STRING NOT NULL,
  data TEXT,
  userId STRING NOT NULL,
  trackId STRING NOT NULL,
  frame INTEGER NOT NULL,
  frames INTEGER NOT NULL,
  label STRING
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE clip;
