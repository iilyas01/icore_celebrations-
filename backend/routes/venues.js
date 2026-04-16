const express = require('express');
const router = express.Router();
const db = require('../db'); 

// GET /api/venues - Get all venues
// This endpoint returns a list of all venues available in the system. Each venue has a unique ID and a name.
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
// This endpoint returns details of a single venue based on its ID. If the venue is not found, it returns a 404 error.
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
