const express = require('express');
const router = express.Router();
const db = require('../db');

// GET api themes - get all themes
// This endpoint returns a list of all themes available in the system. Each theme has a unique ID and a name.
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM THEMES');
    res.json(rows);
  } catch (err) {
    console.error('Get themes error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET api themes with id - get single theme
// This endpoint returns details of a single theme based on its ID. If the theme is not found, it returns a 404 error.
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM THEMES WHERE theme_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Get theme error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;