const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// POST /api/auth/register
// This route allows users to register by providing their name, email, password, and optionally a role (default is 'customer').
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
// Validate that all required fields are provided 
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
// Hash the password before storing it in the database for security reasons. 
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
// Insert the new user into the database with the hashed password and specified role (defaulting to 'customer' if not provided).
    const [result] = await db.query(
      'INSERT INTO USERS (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'customer']
    );
    // Generate a JWT token, which can be used for authentication in future requests. The token will expire in 7 days.
    const token = jwt.sign(
      { user_id: result.insertId, role: role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
// Return a success message along with the generated token in the response.
    res.status(201).json({ message: 'User registered successfully', token });
} catch (err) {
    console.error('Register error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
// Validate that both email and password are provided in the request body. 
// If either is missing, return a 400 Bad Request response with an appropriate error message.
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
// Query the database to find a user with the provided email. If no user is found, return a 401 Unauthorized response indicating invalid credentials.
  try {
    const [rows] = await db.query('SELECT * FROM USERS WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
// Use bcrypt to compare the provided password with the hashed password stored in the database.
//  If the passwords do not match, return a 401 Unauthorized response indicating invalid credentials.
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;