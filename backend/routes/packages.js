const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/packages - get all packages
router.get('/', async (req, res) => {
  try {
    // Join with THEMES to get theme name
    const [rows] = await db.query(`
      SELECT p.*, t.name as theme_name 
      FROM PACKAGES p
      JOIN THEMES t ON p.theme_id = t.theme_id
    `);
    // Map the result to include theme name
    res.json(rows);
  } catch (err) {
    console.error('Get packages error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/packages/:id - get single package
router.get('/:id', async (req, res) => {
  try {
    // Join with THEMES to get theme name
    const [rows] = await db.query(`
      SELECT p.*, t.name as theme_name 
      FROM PACKAGES p
      JOIN THEMES t ON p.theme_id = t.theme_id
      WHERE p.package_id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Get package error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;