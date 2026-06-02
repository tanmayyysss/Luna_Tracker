-- ================================================
--  period_tracker – MySQL Database Schema
-- Run this file in MySQL Workbench or terminal:
--   mysql -u root -p < schema.sql
-- ================================================

CREATE DATABASE IF NOT EXISTS Period tracker;
USE period_tracker;

-- Cycles table: stores each period log
CREATE TABLE IF NOT EXISTS cycles (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  period_start    DATE NOT NULL,
  cycle_length    INT DEFAULT 28,
  period_duration INT DEFAULT 5,
  symptoms        TEXT,
  mood            VARCHAR(10),
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Symptom logs: daily symptom tracking
CREATE TABLE IF NOT EXISTS symptom_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  log_date    DATE NOT NULL,
  symptoms    TEXT,
  mood        VARCHAR(10),
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: insert sample data for testing
INSERT INTO cycles (period_start, cycle_length, period_duration, symptoms, mood, notes)
VALUES
  ('2025-05-01', 28, 5, 'Cramps, Fatigue', '😊', 'Normal cycle'),
  ('2025-04-03', 29, 5, 'Headache, Bloating', '😢', 'Stressful month'),
  ('2025-03-05', 28, 4, 'Cramps', '😊', 'Shorter this time');

SELECT 'period_tracker database setup complete! 🌙' AS message;
