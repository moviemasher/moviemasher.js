
CREATE TABLE IF NOT EXISTS "encodings" (
    id VARCHAR(255) PRIMARY KEY,
    "media_id" VARCHAR(255) NOT NULL,
    "created_at" VARCHAR(255) NOT NULL,
    
    "error" TEXT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    "completed" REAL DEFAULT 0 NOT NULL,
    "name" VARCHAR(255) DEFAULT '' NOT NULL,

    "type" VARCHAR(255) DEFAULT '' NOT NULL,
    "kind" VARCHAR(255) DEFAULT '' NOT NULL
);
