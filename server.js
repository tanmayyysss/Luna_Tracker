const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serves index.html from /public folder

// ─── MySQL Connection ─────────────────────────────────────────
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'luna_tracker'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ MySQL Connected successfully!');
});

// ─── ROUTES ───────────────────────────────────────────────────

// GET all cycles (sorted newest first)
app.get('/api/cycles', (req, res) => {
  db.query('SELECT * FROM cycles ORDER BY period_start DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new cycle log
app.post('/api/cycles', (req, res) => {
  const { period_start, cycle_length, period_duration, symptoms, mood, notes } = req.body;
  if (!period_start) return res.status(400).json({ error: 'period_start is required' });
  const data = { period_start, cycle_length: cycle_length || 28, period_duration: period_duration || 5, symptoms: symptoms || '', mood: mood || '', notes: notes || '' };
  db.query('INSERT INTO cycles SET ?', data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...data });
  });
});

// PUT update cycle
app.put('/api/cycles/:id', (req, res) => {
  const { symptoms, mood, notes, cycle_length, period_duration } = req.body;
  db.query(
    'UPDATE cycles SET symptoms=?, mood=?, notes=?, cycle_length=?, period_duration=? WHERE id=?',
    [symptoms, mood, notes, cycle_length, period_duration, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Updated successfully' });
    }
  );
});

// DELETE cycle
app.delete('/api/cycles/:id', (req, res) => {
  db.query('DELETE FROM cycles WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted successfully' });
  });
});

// GET symptom logs
app.get('/api/symptoms', (req, res) => {
  db.query('SELECT * FROM symptom_logs ORDER BY log_date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST symptom log
app.post('/api/symptoms', (req, res) => {
  const { log_date, symptoms, mood, notes } = req.body;
  db.query('INSERT INTO symptom_logs SET ?',
    { log_date: log_date || new Date().toISOString().split('T')[0], symptoms: symptoms || '', mood: mood || '', notes: notes || '' },
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🌙 Luna API is running' });
});

// ─── START SERVER ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌙 Luna Period Tracker running at http://localhost:${PORT}`);
});
