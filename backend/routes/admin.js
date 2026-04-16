const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Admin only middleware
// Checks if the user is an admin before allowing access to admin routes 
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET /api/admin/orders - get all orders
// Admins can view all orders with user and plan details, sorted by submission date 
router.get('/orders', auth, adminOnly, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name as customer_name, u.email,
      p.event_date, p.guest_count, p.total_estimate,
      t.name as theme_name, v.name as venue_name
      FROM ORDERS o
      JOIN USERS u ON o.user_id = u.user_id
      JOIN PLANS p ON o.plan_id = p.plan_id
      LEFT JOIN THEMES t ON p.theme_id = t.theme_id
      LEFT JOIN VENUES v ON p.venue_id = v.venue_id
      ORDER BY o.submitted_at DESC
    `);
    res.json(orders);
  } catch (err) {
    console.error('Admin get orders error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/orders/:id/approve
// This endpoint allows admins to approve an order by updating its status to "confirmed" and recording the approval decision in the ORDER_APPROVALS table. 
// It first checks if the order exists, and returns a success message. 
router.post('/orders/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const [order] = await db.query('SELECT * FROM ORDERS WHERE order_id = ?', [req.params.id]);
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await db.query('UPDATE ORDERS SET order_status = "confirmed" WHERE order_id = ?', [req.params.id]);

    await db.query(
      'INSERT INTO ORDER_APPROVALS (order_id, decision) VALUES (?, "approved")',
      [req.params.id]
    );

    res.json({ message: 'Order approved successfully' });
  } catch (err) {
    console.error('Approve order error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/orders/:id/reject
// This endpoint allows admins to reject an order by updating its status to "cancelled" and recording the rejection decision in the ORDER_APPROVALS table.
router.post('/orders/:id/reject', auth, adminOnly, async (req, res) => {
  try {
    const [order] = await db.query('SELECT * FROM ORDERS WHERE order_id = ?', [req.params.id]);
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await db.query('UPDATE ORDERS SET order_status = "cancelled" WHERE order_id = ?', [req.params.id]);

    await db.query(
      'INSERT INTO ORDER_APPROVALS (order_id, decision) VALUES (?, "rejected")',
      [req.params.id]
    );

    res.json({ message: 'Order rejected successfully' });
  } catch (err) {
    console.error('Reject order error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;