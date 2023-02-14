


CREATE TABLE IF NOT EXISTS "decodings" (
    id VARCHAR(255) PRIMARY KEY,
    "media_id" VARCHAR(255) NOT NULL,
    "created_at" VARCHAR(255) NOT NULL,
    "error" TEXT,
    "input" TEXT,
    "completed" REAL DEFAULT 0 NOT NULL,

    "info" TEXT,


    "width" BIGINT DEFAULT 0 NOT NULL,
    "height" BIGINT DEFAULT 0 NOT NULL,
    "duration" REAL DEFAULT 0 NOT NULL,
    "audio" BOOLEAN DEFAULT 0 NOT NULL,
    "alpha" BOOLEAN DEFAULT 0 NOT NULL,

    "type" VARCHAR(255) DEFAULT '' NOT NULL,
    "kind" VARCHAR(255) DEFAULT '' NOT NULL
);
