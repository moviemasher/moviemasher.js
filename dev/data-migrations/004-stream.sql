

CREATE TABLE IF NOT EXISTS `stream` (
  id STRING PRIMARY KEY,
  userId STRING,
  castId STRING,
  icon TEXT,
  label STRING,
  json TEXT,
  createdAt STRING NOT NULL
);
