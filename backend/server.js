require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: 'iCore Celebrations API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.stdin.resume();

const db = require('./db');

db.query('SELECT 1')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

  db.query('SELECT DATABASE()')
  .then(([rows]) => console.log(rows));