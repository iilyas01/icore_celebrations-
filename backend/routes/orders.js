const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/orders - create order from current plan
router.post('/', auth, async (req, res) => {
  const user_id = req.user.user_id;

  try {
    // Get the most recent plan for this user
    const [plans] = await db.query(
      'SELECT * FROM PLANS WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );

    if (plans.length === 0) {
      return res.status(400).json({ error: 'No plan found. Please create a plan first.' });
    }

    const plan_id = plans[0].plan_id;

    // Check if order already exists for this plan
    const [existing] = await db.query(
      'SELECT * FROM ORDERS WHERE plan_id = ?',
      [plan_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Order already exists for this plan' });
    }
  
    const [result] = await db.query(
      'INSERT INTO ORDERS (plan_id, user_id, order_status, payment_status) VALUES (?, ?, "pending", "unpaid")',
      [plan_id, user_id]
    );

    res.status(201).json({ message: 'Order created successfully', order_id: result.insertId });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/my - get current user's orders
// This endpoint retrieves all orders for the authenticated user, including details from the related PLANS, THEMES, and VENUES tables. 
// It uses JOINs to gather all relevant information in a single query and returns the orders sorted by submission date in descending order.
router.get('/my', auth, async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const [orders] = await db.query(
      `SELECT o.*, p.event_date, p.guest_count, p.total_estimate,
       t.name as theme_name, v.name as venue_name
       FROM ORDERS o
       JOIN PLANS p ON o.plan_id = p.plan_id
       LEFT JOIN THEMES t ON p.theme_id = t.theme_id
       LEFT JOIN VENUES v ON p.venue_id = v.venue_id
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

module.exports = router;