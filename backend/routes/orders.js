const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/orders - create order from current plan
router.post('/', auth, async (req, res) => {
  const user_id = req.user.user_id;
  const { plan_id } = req.body;

  try {
    let planId;

    if (plan_id) {
      // Use plan_id from request body
      const [planRows] = await db.query(
        'SELECT * FROM plans WHERE plan_id = ? AND user_id = ?',
        [plan_id, user_id]
      );
      if (planRows.length === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      planId = plan_id;
    } else {
      // Fall back to most recent plan
      const [planRows] = await db.query(
        'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [user_id]
      );
      if (planRows.length === 0) {
        return res.status(400).json({ error: 'No plan found. Please create a plan first.' });
      }
      planId = planRows[0].plan_id;
    }

    // Check if order already exists for this plan
    const [existingOrders] = await db.query(
      'SELECT * FROM orders WHERE plan_id = ?',
      [planId]
    );

    if (existingOrders.length > 0) {
      // Return existing order instead of error
      return res.json({ message: 'Order already exists', order_id: existingOrders[0].order_id });
    }

    // Create new order
    const [result] = await db.query(
      'INSERT INTO orders (plan_id, user_id, order_status, payment_status) VALUES (?, ?, "pending", "unpaid")',
      [planId, user_id]
    );

    res.status(201).json({ message: 'Order created successfully', order_id: result.insertId });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders - get all orders for current user
router.get('/', auth, async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const [orders] = await db.query(
      `SELECT o.*, p.event_date, p.guest_count, p.total_estimate,
       t.name as theme_name, v.name as venue_name,
       v.price_per_day
       FROM orders o
       JOIN plans p ON o.plan_id = p.plan_id
       LEFT JOIN themes t ON p.theme_id = t.theme_id
       LEFT JOIN venues v ON p.venue_id = v.venue_id
       WHERE o.order_id = ? AND o.user_id = ?`,
      [req.params.id, req.user.user_id]
    );

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/my - get current user's orders
router.get('/my', auth, async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const [orders] = await db.query(
      `SELECT o.*, p.event_date, p.guest_count, p.total_estimate,
       t.name as theme_name, v.name as venue_name
       FROM orders o
       JOIN plans p ON o.plan_id = p.plan_id
       LEFT JOIN themes t ON p.theme_id = t.theme_id
       LEFT JOIN venues v ON p.venue_id = v.venue_id
       WHERE o.user_id = ?
       ORDER BY o.submitted_at DESC`,
      [user_id]
    );

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/:id - get single order by id
router.get('/:id', auth, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, p.event_date, p.guest_count, p.total_estimate,
       t.name as theme_name, v.name as venue_name,
       v.price_per_day
       FROM orders o
       JOIN plans p ON o.plan_id = p.plan_id
       LEFT JOIN themes t ON p.theme_id = t.theme_id
       LEFT JOIN venues v ON p.venue_id = v.venue_id
       WHERE o.order_id = ? AND o.user_id = ?`,
      [req.params.id, req.user.user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orders[0]);
  } catch (err) {
    console.error('Get order error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;