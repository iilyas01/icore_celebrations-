const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all themes
router.get('/', async (req, res) => {
  try {
    // Simple query to get all themes
    const [rows] = await db.query('SELECT * FROM themes');
    res.json(rows);
  } catch (err) {
    console.error('Get themes error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single theme by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM themes WHERE theme_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    // Return the first (and only) theme found
    res.json(rows[0]);
  } catch (err) {
    console.error('Get theme error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;