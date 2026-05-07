const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// ─────────────────────────────────────────────
// HELPER: Recalculate total estimate for a plan
// Adds up venue price + all package totals + all service prices
// Called after every add/remove operation to keep total up to date
// ─────────────────────────────────────────────
const recalculateTotal = async (plan_id) => {
  try {
    // Get venue price for this plan
    const [planRows] = await db.query(
      `SELECT p.*, v.price_per_day 
       FROM plans p 
       JOIN venues v ON p.venue_id = v.venue_id 
       WHERE p.plan_id = ?`,
      [plan_id]
    );
    if (planRows.length === 0) return;

    const venue_price = parseFloat(planRows[0].price_per_day) || 0;

    // Get total from all packages in this plan
    const [packages] = await db.query(
      'SELECT SUM(pp.total) as pkg_total FROM plan_packages pp WHERE pp.plan_id = ?',
      [plan_id]
    );
    const pkg_total = parseFloat(packages[0].pkg_total) || 0;

    // Get total from all services in this plan
    const [services] = await db.query(
      `SELECT SUM(s.estimated_price * ps.quantity) as svc_total 
       FROM plan_services ps 
       JOIN services s ON ps.service_id = s.service_id 
       WHERE ps.plan_id = ?`,
      [plan_id]
    );
    const svc_total = parseFloat(services[0].svc_total) || 0;

    // Calculate grand total and update the plan
    const total = venue_price + pkg_total + svc_total;
    await db.query(
      'UPDATE plans SET total_estimate = ? WHERE plan_id = ?',
      [total, plan_id]
    );
  } catch (err) {
    console.error('Recalculate total error:', err.message);
  }
};

// ─────────────────────────────────────────────
// GET /api/plans/my
// Returns the current user's most recent plan
// including theme name, venue name, services, and packages
// ─────────────────────────────────────────────
router.get('/my', auth, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Get the most recent plan with theme and venue names
    const [plans] = await db.query(`
      SELECT p.*, t.name as theme_name, v.name as venue_name
      FROM plans p
      LEFT JOIN themes t ON p.theme_id = t.theme_id
      LEFT JOIN venues v ON p.venue_id = v.venue_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT 1
    `, [user_id]);

    if (plans.length === 0) {
      return res.json({ message: 'No plan found', plan: null });
    }

    const plan = plans[0];

    // Get all services added to this plan with service details
    const [services] = await db.query(`
      SELECT s.*, ps.quantity
      FROM plan_services ps
      JOIN services s ON ps.service_id = s.service_id
      WHERE ps.plan_id = ?
    `, [plan.plan_id]);

    // Get all packages added to this plan with package details
    const [packages] = await db.query(`
      SELECT pk.*, pp.quantity, pp.total
      FROM plan_packages pp
      JOIN packages pk ON pp.package_id = pk.package_id
      WHERE pp.plan_id = ?
    `, [plan.plan_id]);

    res.json({ plan, services, packages });
  } catch (err) {
    console.error('Get plan error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// POST /api/plans/theme
// Creates a new plan or updates existing plan with theme + venue
// Also accepts event_date and guest_count
// Recalculates total after creation
// ─────────────────────────────────────────────
router.post('/theme', auth, async (req, res) => {
  const { theme_id, venue_id, event_date, guest_count } = req.body;
  const user_id = req.user.user_id;

  if (!theme_id || !venue_id) {
    return res.status(400).json({ error: 'theme_id and venue_id are required' });
  }

  try {
    // Check if user already has a plan
    const [existing] = await db.query(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (existing.length > 0) {
      // Update existing plan with new theme, venue, date, and guest count
      await db.query(
        'UPDATE plans SET theme_id = ?, venue_id = ?, event_date = ?, guest_count = ? WHERE plan_id = ?',
        [
          theme_id,
          venue_id,
          event_date || new Date().toISOString().split('T')[0],
          guest_count || existing[0].guest_count,
          existing[0].plan_id
        ]
      );
      await recalculateTotal(existing[0].plan_id);
      return res.json({ message: 'Theme and venue updated', plan_id: existing[0].plan_id });
    }

    // Create a new plan with theme, venue, date, and guest count
    const [result] = await db.query(
      'INSERT INTO plans (user_id, theme_id, venue_id, event_date, guest_count, total_estimate) VALUES (?, ?, ?, ?, ?, 0)',
      [
        user_id,
        theme_id,
        venue_id,
        event_date || new Date().toISOString().split('T')[0],
        guest_count || 0
      ]
    );

    // Recalculate total to include venue price
    await recalculateTotal(result.insertId);

    res.status(201).json({ message: 'Plan created with theme and venue', plan_id: result.insertId });
  } catch (err) {
    console.error('Add theme error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// POST /api/plans/venue
// Updates the venue on an existing plan
// Requires a plan to already exist (theme must be set first)
// Recalculates total after update
// ─────────────────────────────────────────────
router.post('/venue', auth, async (req, res) => {
  const { venue_id } = req.body;
  const user_id = req.user.user_id;

  try {
    const [existing] = await db.query(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (existing.length === 0) {
      return res.status(400).json({ error: 'No plan found. Please add a theme first.' });
    }

    await db.query(
      'UPDATE plans SET venue_id = ? WHERE plan_id = ?',
      [venue_id, existing[0].plan_id]
    );

    await recalculateTotal(existing[0].plan_id);
    res.json({ message: 'Venue added to plan', plan_id: existing[0].plan_id });
  } catch (err) {
    console.error('Add venue error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// POST /api/plans/services
// Adds a service to the user's current plan
// Checks for duplicates before inserting
// Recalculates total after insert
// ─────────────────────────────────────────────
router.post('/services', auth, async (req, res) => {
  const { service_id, quantity = 1 } = req.body;
  const user_id = req.user.user_id;

  try {
    const [existing] = await db.query(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (existing.length === 0) {
      return res.status(400).json({ error: 'No plan found. Please add a theme first.' });
    }

    const plan_id = existing[0].plan_id;

    // Check if service is already in this plan
    const [alreadyAdded] = await db.query(
      'SELECT * FROM plan_services WHERE plan_id = ? AND service_id = ?',
      [plan_id, service_id]
    );

    if (alreadyAdded.length > 0) {
      return res.status(409).json({ error: 'Service already added to plan' });
    }

    // Insert the service into the plan
    await db.query(
      'INSERT INTO plan_services (plan_id, service_id, quantity) VALUES (?, ?, ?)',
      [plan_id, service_id, quantity]
    );

    // Recalculate total to include new service price
    await recalculateTotal(plan_id);
    res.status(201).json({ message: 'Service added to plan' });
  } catch (err) {
    console.error('Add service error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// POST /api/plans/packages
// Adds a package to the user's current plan
// Validates package exists, checks for duplicates
// Calculates line total (price x quantity)
// Recalculates plan total after insert
// ─────────────────────────────────────────────
router.post('/packages', auth, async (req, res) => {
  const { package_id, quantity = 1 } = req.body;
  const user_id = req.user.user_id;

  try {
    const [existing] = await db.query(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (existing.length === 0) {
      return res.status(400).json({ error: 'No plan found. Please add a theme first.' });
    }

    const plan_id = existing[0].plan_id;

    // Validate package exists and get its price
    const [pkg] = await db.query(
      'SELECT * FROM packages WHERE package_id = ?',
      [package_id]
    );
    if (pkg.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Calculate line total
    const total = pkg[0].price * quantity;

    // Check if package is already in this plan
    const [alreadyAdded] = await db.query(
      'SELECT * FROM plan_packages WHERE plan_id = ? AND package_id = ?',
      [plan_id, package_id]
    );

    if (alreadyAdded.length > 0) {
      return res.status(409).json({ error: 'Package already added to plan' });
    }

    // Insert the package into the plan with quantity and total
    await db.query(
      'INSERT INTO plan_packages (plan_id, package_id, quantity, total) VALUES (?, ?, ?, ?)',
      [plan_id, package_id, quantity, total]
    );

    // Recalculate total to include new package price
    await recalculateTotal(plan_id);
    res.status(201).json({ message: 'Package added to plan', total });
  } catch (err) {
    console.error('Add package error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/plans/guests
// Updates the guest count on the user's current plan
// ─────────────────────────────────────────────
router.put('/guests', auth, async (req, res) => {
  const { guest_count } = req.body;
  const user_id = req.user.user_id;

  try {
    const [plans] = await db.query(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ error: 'No plan found' });
    }

    await db.query(
      'UPDATE plans SET guest_count = ? WHERE plan_id = ?',
      [guest_count, plans[0].plan_id]
    );

    res.json({ message: 'Guest count updated', guest_count });
  } catch (err) {
    console.error('Update guests error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/plans/services/:service_id
// Removes a service from the user's current plan
// Recalculates total after removal
// ─────────────────────────────────────────────
router.delete('/services/:service_id', auth, async (req, res) => {
  const user_id = req.user.user_id;
  const { service_id } = req.params;

  try {
    const [plans] = await db.query(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ error: 'No plan found' });
    }

    await db.query(
      'DELETE FROM plan_services WHERE plan_id = ? AND service_id = ?',
      [plans[0].plan_id, service_id]
    );

    // Recalculate total after removing service
    await recalculateTotal(plans[0].plan_id);
    res.json({ message: 'Service removed from plan' });
  } catch (err) {
    console.error('Remove service error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/plans/packages/:package_id
// Removes a package from the user's current plan
// Recalculates total after removal
// ─────────────────────────────────────────────
router.delete('/packages/:package_id', auth, async (req, res) => {
  const user_id = req.user.user_id;
  const { package_id } = req.params;

  try {
    const [plans] = await db.query(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ error: 'No plan found' });
    }

    await db.query(
      'DELETE FROM plan_packages WHERE plan_id = ? AND package_id = ?',
      [plans[0].plan_id, package_id]
    );

    // Recalculate total after removing package
    await recalculateTotal(plans[0].plan_id);
    res.json({ message: 'Package removed from plan' });
  } catch (err) {
    console.error('Remove package error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/plans/my
// Deletes the user's entire current plan
// Cascades to PLAN_SERVICES and PLAN_PACKAGES
// ─────────────────────────────────────────────
router.delete('/my', auth, async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const [plans] = await db.query(
      'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ error: 'No plan found' });
    }

    // Delete plan — cascades to PLAN_SERVICES and PLAN_PACKAGES
    await db.query('DELETE FROM plans WHERE plan_id = ?', [plans[0].plan_id]);
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    console.error('Delete plan error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;