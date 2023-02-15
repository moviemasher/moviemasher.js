

CREATE TABLE IF NOT EXISTS "media" (
    id VARCHAR(255) PRIMARY KEY,
    "object_id" VARCHAR(255),
    "user_id" VARCHAR(255) NOT NULL,
    "created_at" VARCHAR(255) NOT NULL,
    "deleted_at" VARCHAR(255),
    "label" VARCHAR(255),
    "type" VARCHAR(255) DEFAULT '' NOT NULL,
    "kind" VARCHAR(255) DEFAULT '' NOT NULL,
    "request" TEXT
);
