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

app.get('/', (req, res) => {
  res.json({ message: 'iCore Celebrations API is running' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  db.query('SELECT 1')
    .then(() => console.log('✅ Database connected successfully'))
    .catch(err => console.error('❌ Database connection failed:', err.message));
});

