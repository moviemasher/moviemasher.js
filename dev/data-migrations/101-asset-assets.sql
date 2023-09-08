

CREATE TABLE IF NOT EXISTS asset_assets (
  id VARCHAR(255) PRIMARY KEY,
  owner_id VARCHAR(255) NOT NULL,
  asset_id VARCHAR(255) NOT NULL,
  created timestamp with time zone DEFAULT now()
);
