const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/checkout/create-session
router.post('/create-session', auth, async (req, res) => {
  const { order_id } = req.body;

  try {
    const [orders] = await db.query(
      'SELECT * FROM ORDERS WHERE order_id = ?',
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // 
    await db.query(
      'UPDATE ORDERS SET payment_status = "paid", order_status = "pending" WHERE order_id = ?',
      [order_id]
    );

    // Redirect to success page
    res.json({ url: `${req.body.origin_url}/order-success/${order_id}` });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/checkout/status/:sessionId
router.get('/status/:sessionId', auth, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM ORDERS WHERE order_id = ?',
      [req.params.sessionId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ status: orders[0].payment_status, order: orders[0] });
  } catch (err) {
    console.error('Status error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;