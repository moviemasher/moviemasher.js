

CREATE TABLE IF NOT EXISTS `cast` (
  id STRING PRIMARY KEY,
  userId STRING,
  icon TEXT,
  label STRING,
  json TEXT,
  createdAt STRING NOT NULL
);

