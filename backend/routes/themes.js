const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM themes');
    res.json(rows);
  } catch (err) {
    console.error('Get themes error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM themes WHERE theme_id = ?', [req.params.id]);
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