
CREATE TABLE IF NOT EXISTS `definition` (
  id STRING PRIMARY KEY,
  userId STRING,
  icon TEXT,
  label STRING,
  json TEXT,
  type STRING NOT NULL,
  createdAt STRING NOT NULL
);

