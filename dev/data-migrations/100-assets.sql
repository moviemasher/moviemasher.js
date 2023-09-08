

CREATE TABLE IF NOT EXISTS assets (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  label VARCHAR(255),
  type VARCHAR(255) DEFAULT '' NOT NULL,
  source VARCHAR(255) DEFAULT '' NOT NULL,
  rest JSONB,
  created timestamp with time zone DEFAULT now(),
  deleted timestamp with time zone
);
