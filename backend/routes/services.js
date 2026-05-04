const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM services');
    res.json(rows);
  } catch (err) {
    console.error('Get services error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM services WHERE service_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Get service error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;