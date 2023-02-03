

CREATE TABLE IF NOT EXISTS  `mash` (
  id STRING PRIMARY KEY,
  userId STRING,
  icon TEXT,
  label STRING,
  json TEXT,
  createdAt STRING NOT NULL
);

