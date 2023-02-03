

CREATE TABLE IF NOT EXISTS `stream_definition` (
  id STRING PRIMARY KEY,
  streamId STRING NOT NULL,
  definitionId STRING NOT NULL,
  createdAt STRING NOT NULL
);
