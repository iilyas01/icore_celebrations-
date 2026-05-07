// Handles all admin-only operations: viewing orders,
// approving/rejecting orders, and CRUD for venues, services,
// themes, and packages.
const express = require('express');        // Import Express to create a router
const router = express.Router();           // Create a modular router instance
const db = require('../db');               // Import the database connection/query helper
const auth = require('../middleware/auth'); // Import auth middleware to verify JWT tokens

// MIDDLEWARE: adminOnly
// Runs after the `auth` middleware. `auth` attaches the decoded
// JWT payload to req.user. This middleware then checks if the
// user's role is 'admin'. If not, it immediately returns a 403
// Forbidden response and stops the request from going further.
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    // 403 = Forbidden: the user is authenticated but not authorized
    return res.status(403).json({ error: 'Admin access required' });
  }
  next(); // Role is admin — proceed to the actual route handler
};

// GET /api/admin/orders
// Returns all orders with full details: customer info, plan
// info, theme name, and venue name. Sorted newest first.
router.get('/orders', auth, adminOnly, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.*,                                      -- All columns from the orders table
        u.name AS customer_name,                  -- Customer's full name aliased for clarity
        u.email,                                  -- Customer's email
        o.submitted_at AS order_date,             --  submitted_at as order_date for frontend use
        o.order_status AS status,                 --  order_status as status for frontend use
        p.event_date,                             -- Event date from the linked plan
        p.guest_count,                            -- Guest count from the linked plan
       p.total_estimate AS total_estimate,
       p.total_estimate AS total_price,         -- Total estimate aliased as total_price
        t.name AS theme_name,                     -- Theme name (LEFT JOIN so null if no theme)
        v.name AS venue_name                      -- Venue name (LEFT JOIN so null if no venue)
      FROM orders o
      JOIN users u ON o.user_id = u.user_id       -- Inner join: every order must have a user
      JOIN plans p ON o.plan_id = p.plan_id       -- Inner join: every order must have a plan
      LEFT JOIN themes t ON p.theme_id = t.theme_id   
      LEFT JOIN venues v ON p.venue_id = v.venue_id   
      ORDER BY o.submitted_at DESC                
    `);
    res.json(orders); // Send the array of orders as JSON
  } catch (err) {
    console.error('Admin get orders error:', err.message);
    res.status(500).json({ error: 'Server error' }); 
  }
});
// GET /api/admin/packages
// Returns all packages sorted by package_id ascending,
// so newly added packages appear at the end of the list.
router.get('/packages', auth, adminOnly, async (req, res) => {
  try {
    const [packages] = await db.query('SELECT * FROM packages ORDER BY package_id ASC');
    res.json(packages);
  } catch (err) {
    console.error('Admin get packages error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
// POST /api/admin/orders/:id/approve
//  Update order_status to "confirmed" and payment_status to "paid".
//  Insert an approval record into ORDER_APPROVALS for audit trail.
router.post('/orders/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    // Step 1: Check if the order exists using the URL param :id
    const [order] = await db.query('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' }); // 404 = resource not found
    }

    // Step 2: Mark the order as confirmed and paid
    await db.query(
      'UPDATE orders SET order_status = "confirmed", payment_status = "paid" WHERE order_id = ?',
      [req.params.id]
    );

    // Step 3: Log the approval decision in the audit table
    await db.query(
      'INSERT INTO order_approvals (order_id, decision) VALUES (?, "approved")',
      [req.params.id]
    );

    res.json({ message: 'Order approved successfully' });
  } catch (err) {
    console.error('Approve order error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/orders/:id/reject
router.post('/orders/:id/reject', auth, adminOnly, async (req, res) => {
  try {
    // Step 1: Verify the order exists before trying to update it
    const [order] = await db.query('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Step 2: Mark the order as cancelled and refunded
    await db.query(
      'UPDATE orders SET order_status = "cancelled", payment_status = "refunded" WHERE order_id = ?',
      [req.params.id]
    );

    // Step 3: Log the rejection decision in the audit table
    await db.query(
      'INSERT INTO order_approvals (order_id, decision) VALUES (?, "rejected")',
      [req.params.id]
    );

    res.json({ message: 'Order rejected successfully' });
  } catch (err) {
    console.error('Reject order error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/venues
// Adds a new venue to the database 
// Uses `|| null` so missing/empty fields are stored as NULL
router.post('/venues', auth, adminOnly, async (req, res) => {
  const { name, image_url, location, capacity, price_per_day, vendor_link } = req.body;
  try {
    await db.query(
      'INSERT INTO venues (name, image_url, location, capacity, price_per_day, vendor_link) VALUES (?, ?, ?, ?, ?, ?)',
      [name || null, image_url || null, location || null, capacity || null, price_per_day || null, vendor_link || null]
    );
    res.status(201).json({ message: 'Venue added successfully' }); // 201 = resource created
  } catch (err) {
    console.error('Venue POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// POST /api/admin/services
// Adds a new service to the database.
router.post('/services', auth, adminOnly, async (req, res) => {
  const { name, image_url, category, estimated_price, vendor_link } = req.body;
  try {
    await db.query(
      'INSERT INTO services (name, image_url, category, estimated_price, vendor_link) VALUES (?, ?, ?, ?, ?)',
      [name || null, image_url || null, category || null, estimated_price || null, vendor_link || null]
    );
    res.status(201).json({ message: 'Service added successfully' });
  } catch (err) {
    console.error('Service POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/themes
// Adds a new theme to the database.
router.post('/themes', auth, adminOnly, async (req, res) => {
  const { name, description, image_url } = req.body;
  try {
    await db.query(
      'INSERT INTO themes (name, description, image_url) VALUES (?, ?, ?)',
      [name || null, description || null, image_url || null]
    );
    res.status(201).json({ message: 'Theme added successfully' });
  } catch (err) {
    console.error('Theme POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/packages
// Adds a new package to the database.
// theme_id is optional (a package may not be tied to a theme).
router.post('/packages', auth, adminOnly, async (req, res) => {
  const { name, description, image_url, price, theme_id } = req.body;
  try {
    await db.query(
      'INSERT INTO packages (name, description, image_url, price, theme_id) VALUES (?, ?, ?, ?, ?)',
      [name || null, description || null, image_url || null, price || null, theme_id || null]
    );
    res.status(201).json({ message: 'Package added successfully' });
  } catch (err) {
    console.error('Package POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/venues/:id
// Updates an existing venue by ID.
// All fields are replaced — send the full object from the
router.put('/venues/:id', auth, adminOnly, async (req, res) => {
  const { name, image_url, location, capacity, price_per_day, vendor_link } = req.body;
  try {
    // Check the venue exists before updating
    const [venue] = await db.query('SELECT * FROM venues WHERE venue_id = ?', [req.params.id]);
    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    await db.query(
      'UPDATE venues SET name = ?, image_url = ?, location = ?, capacity = ?, price_per_day = ?, vendor_link = ? WHERE venue_id = ?',
      [name || null, image_url || null, location || null, capacity || null, price_per_day || null, vendor_link || null, req.params.id]
    );
    res.json({ message: 'Venue updated successfully' });
  } catch (err) {
    console.error('Venue PUT error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/admin/services/:id
// Updates an existing service
router.put('/services/:id', auth, adminOnly, async (req, res) => {
  const { name, image_url, category, estimated_price, vendor_link } = req.body;
  try {
    // Check the service exists before updating
    const [service] = await db.query('SELECT * FROM services WHERE service_id = ?', [req.params.id]);
    if (service.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await db.query(
      'UPDATE services SET name = ?, image_url = ?, category = ?, estimated_price = ?, vendor_link = ? WHERE service_id = ?',
      [name || null, image_url || null, category || null, estimated_price || null, vendor_link || null, req.params.id]
    );
    res.json({ message: 'Service updated successfully' });
  } catch (err) {
    console.error('Service PUT error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/admin/themes/:id
// Updates an existing theme 
router.put('/themes/:id', auth, adminOnly, async (req, res) => {
  const { name, description, image_url } = req.body;
  try {
    // Check the theme exists before updating
    const [theme] = await db.query('SELECT * FROM themes WHERE theme_id = ?', [req.params.id]);
    if (theme.length === 0) {
      return res.status(404).json({ error: 'Theme not found' });
    }

    await db.query(
      'UPDATE themes SET name = ?, description = ?, image_url = ? WHERE theme_id = ?',
      [name || null, description || null, image_url || null, req.params.id]
    );
    res.json({ message: 'Theme updated successfully' });
  } catch (err) {
    console.error('Theme PUT error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/admin/packages/:id
// Updates an existing package 
router.put('/packages/:id', auth, adminOnly, async (req, res) => {
  const { name, description, image_url, price, theme_id } = req.body;
  try {
    // Check the package exists before updating
    const [pkg] = await db.query('SELECT * FROM packages WHERE package_id = ?', [req.params.id]);
    if (pkg.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    await db.query(
      'UPDATE packages SET name = ?, description = ?, image_url = ?, price = ?, theme_id = ? WHERE package_id = ?',
      [name || null, description || null, image_url || null, price || null, theme_id || null, req.params.id]
    );
    res.json({ message: 'Package updated successfully' });
  } catch (err) {
    console.error('Package PUT error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// DELETE /api/admin/themes/:id
// Deletes a theme by ID.
// Checks existence first so the API returns a proper 404
router.delete('/themes/:id', auth, adminOnly, async (req, res) => {
  try {
    const [theme] = await db.query('SELECT * FROM themes WHERE theme_id = ?', [req.params.id]);
    if (theme.length === 0) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    await db.query('DELETE FROM themes WHERE theme_id = ?', [req.params.id]);
    res.json({ message: 'Theme deleted successfully' });
  } catch (err) {
    console.error('Delete theme error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
// DELETE /api/admin/venues/:id
// Deletes a venue by ID. Checks existence before deleting.
router.delete('/venues/:id', auth, adminOnly, async (req, res) => {
  try {
    const [venue] = await db.query('SELECT * FROM venues WHERE venue_id = ?', [req.params.id]);
    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    await db.query('DELETE FROM venues WHERE venue_id = ?', [req.params.id]);
    res.json({ message: 'Venue deleted successfully' });
  } catch (err) {
    console.error('Delete venue error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
// DELETE /api/admin/services/:id
// Deletes a service by ID. Checks existence before deleting.
router.delete('/services/:id', auth, adminOnly, async (req, res) => {
  try {
    const [service] = await db.query('SELECT * FROM services WHERE service_id = ?', [req.params.id]);
    if (service.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    await db.query('DELETE FROM services WHERE service_id = ?', [req.params.id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Delete service error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
// DELETE /api/admin/packages/:id
// Deletes a package by ID. Checks existence before deleting.
router.delete('/packages/:id', auth, adminOnly, async (req, res) => {
  try {
    const [pkg] = await db.query('SELECT * FROM packages WHERE package_id = ?', [req.params.id]);
    if (pkg.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }
    await db.query('DELETE FROM packages WHERE package_id = ?', [req.params.id]);
    res.json({ message: 'Package deleted successfully' });
  } catch (err) {
    console.error('Delete package error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// Export the router so it can be mounted in app.js/server.js
module.exports = router;