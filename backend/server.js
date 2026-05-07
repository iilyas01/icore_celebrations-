require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/themes', require('./routes/themes'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/services', require('./routes/services'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/checkout', require('./routes/checkout'));

app.get('/', (req, res) => {
  res.json({ message: 'iCore Celebrations API is running' });
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SHOW TABLES');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  db.query('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err.message));
});