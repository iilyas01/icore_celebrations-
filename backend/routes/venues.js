const express = require('express');
const router = express.Router();
const db = require('../db'); 

// GET /api/venues - Get all venues
router.get('/', async (req, res) => {
  try {
    const [venues] = await db.query('SELECT * FROM VENUES');
    res.json(venues);
  } catch (err) {
    console.error('Error fetching venues:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}); 

// GET api venues id - Get a single venue by ID 
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [venues] = await db.query('SELECT * FROM VENUES WHERE venue_id = ?', [id]);
    if (venues.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venues[0]);
  } catch (err) {
    console.error('Error fetching venue:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 
