const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/plans/my - get current user's plan
router.get('/my', auth, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Get the plan
    const [plans] = await db.query(`
      SELECT p.*, t.name as theme_name, v.name as venue_name
      FROM PLANS p
      LEFT JOIN THEMES t ON p.theme_id = t.theme_id
      LEFT JOIN VENUES v ON p.venue_id = v.venue_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT 1
    `, [user_id]);

    if (plans.length === 0) {
      return res.json({ message: 'No plan found', plan: null });
    }

    const plan = plans[0];

    // Get services for this plan
    const [services] = await db.query(`
      SELECT s.*, ps.quantity
      FROM PLAN_SERVICES ps
      JOIN SERVICES s ON ps.service_id = s.service_id
      WHERE ps.plan_id = ?
    `, [plan.plan_id]);

    // Get packages for this plan
    const [packages] = await db.query(`
      SELECT pk.*, pp.quantity, pp.total
      FROM PLAN_PACKAGES pp
      JOIN PACKAGES pk ON pp.package_id = pk.package_id
      WHERE pp.plan_id = ?
    `, [plan.plan_id]);

    res.json({ plan, services, packages });
  } catch (err) {
    console.error('Get plan error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/plans/theme - set theme and venue on plan
router.post('/theme', auth, async (req, res) => {
    const { theme_id, venue_id } = req.body;
    const user_id = req.user.user_id;
  
    if (!theme_id || !venue_id) {
      return res.status(400).json({ error: 'theme_id and venue_id are required' });
    }
  
    try {
      const [existing] = await db.query(
        'SELECT * FROM PLANS WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [user_id]
      );
  
      if (existing.length > 0) {
        await db.query('UPDATE PLANS SET theme_id = ?, venue_id = ? WHERE plan_id = ?',
          [theme_id, venue_id, existing[0].plan_id]);
        return res.json({ message: 'Theme and venue updated', plan_id: existing[0].plan_id });
      }
  
      const [result] = await db.query(
        'INSERT INTO PLANS (user_id, theme_id, venue_id, event_date, guest_count, total_estimate) VALUES (?, ?, ?, CURDATE(), ?, ?)',
        [user_id, theme_id, venue_id, 0, 0]
      );
      res.status(201).json({ message: 'Plan created with theme and venue', plan_id: result.insertId });
    } catch (err) {
      console.error('Add theme error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });

// POST /api/plans/venue - set venue on plan
router.post('/venue', auth, async (req, res) => {
  const { venue_id } = req.body;
  const user_id = req.user.user_id;

  try {
    const [existing] = await db.query(
      'SELECT * FROM PLANS WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (existing.length === 0) {
      return res.status(400).json({ error: 'No plan found. Please add a theme first.' });
    }

    await db.query('UPDATE PLANS SET venue_id = ? WHERE plan_id = ?',
      [venue_id, existing[0].plan_id]);
    res.json({ message: 'Venue added to plan', plan_id: existing[0].plan_id });
  } catch (err) {
    console.error('Add venue error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/plans/services - add service to plan
router.post('/services', auth, async (req, res) => {
  const { service_id, quantity = 1 } = req.body;
  const user_id = req.user.user_id;

  try {
    const [existing] = await db.query(
      'SELECT * FROM PLANS WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (existing.length === 0) {
      return res.status(400).json({ error: 'No plan found. Please add a theme first.' });
    }

    const plan_id = existing[0].plan_id;

    // Check if service already in plan
    const [alreadyAdded] = await db.query(
      'SELECT * FROM PLAN_SERVICES WHERE plan_id = ? AND service_id = ?',
      [plan_id, service_id]
    );

    if (alreadyAdded.length > 0) {
      return res.status(409).json({ error: 'Service already added to plan' });
    }

    await db.query(
      'INSERT INTO PLAN_SERVICES (plan_id, service_id, quantity) VALUES (?, ?, ?)',
      [plan_id, service_id, quantity]
    );

    res.status(201).json({ message: 'Service added to plan' });
  } catch (err) {
    console.error('Add service error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/plans/packages - add package to plan
router.post('/packages', auth, async (req, res) => {
  const { package_id, quantity = 1 } = req.body;
  const user_id = req.user.user_id;

  try {
    const [existing] = await db.query(
      'SELECT * FROM PLANS WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (existing.length === 0) {
      return res.status(400).json({ error: 'No plan found. Please add a theme first.' });
    }

    const plan_id = existing[0].plan_id;

    // Get package price
    const [pkg] = await db.query('SELECT * FROM PACKAGES WHERE package_id = ?', [package_id]);
    if (pkg.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const total = pkg[0].price * quantity;

    // Check if package already in plan
    const [alreadyAdded] = await db.query(
      'SELECT * FROM PLAN_PACKAGES WHERE plan_id = ? AND package_id = ?',
      [plan_id, package_id]
    );

    if (alreadyAdded.length > 0) {
      return res.status(409).json({ error: 'Package already added to plan' });
    }

    await db.query(
      'INSERT INTO PLAN_PACKAGES (plan_id, package_id, quantity, total) VALUES (?, ?, ?, ?)',
      [plan_id, package_id, quantity, total]
    );

    res.status(201).json({ message: 'Package added to plan', total });
  } catch (err) {
    console.error('Add package error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;