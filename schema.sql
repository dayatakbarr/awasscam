-- Turso / SQLite Schema for AwasScam
-- Run: turso db shell awasscam < schema.sql

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  contact TEXT NOT NULL,
  chronology TEXT NOT NULL,
  loss_amount INTEGER DEFAULT 0,
  evidence_files TEXT DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
  reporter_ip TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  verified_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at DESC);

CREATE TABLE IF NOT EXISTS ai_analysis_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  input_text TEXT,
  result_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- View for verified reports with parsed evidence
CREATE VIEW IF NOT EXISTS verified_reports AS
SELECT 
  id,
  type,
  contact,
  chronology,
  loss_amount,
  json_each.value AS evidence_file,
  status,
  created_at,
  view_count
FROM reports, json_each(evidence_files)
WHERE status = 'verified';