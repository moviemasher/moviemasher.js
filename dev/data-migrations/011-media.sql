

CREATE TABLE IF NOT EXISTS "media" (
    id VARCHAR(255) PRIMARY KEY,
    "object_id" VARCHAR(255),
    "created_at" VARCHAR(255) NOT NULL,
    "request" TEXT,
    "url" VARCHAR(255),
    "name" VARCHAR(255),
    "user_id" VARCHAR(255) NOT NULL,
    "size" BIGINT DEFAULT 0 NOT NULL,
    "type" VARCHAR(255) DEFAULT '' NOT NULL,
    "kind" VARCHAR(255) DEFAULT '' NOT NULL
);
