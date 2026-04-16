const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/services - Get all services
// This endpoint returns all services available in the system. Services are individual items that can be added to a plan. 
router.get('/', async (req, res) => {
  try {
    const [services] = await db.query('SELECT * FROM SERVICES');
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}); 

// GET api services id - Get a single service by ID
// This endpoint returns details of a single service based on its ID.
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [services] = await db.query('SELECT * FROM SERVICES WHERE service_id = ?', [id]);
    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(services[0]);
  } catch (err) {
    console.error('Error fetching service:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
