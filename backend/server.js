//load variable from .env file into process.env
require('dotenv').config();
//import express framework to create server and handle routes 
const express = require('express');
// import cors to allow cross-origin requests from frontend 
const cors = require('cors');
// import db connection pool to interact with MySQL database
const db = require('./db');
// create an instance of express application 
const app = express();

app.use(cors());
app.use(express.json());

// Routes for different API endpoints 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/themes', require('./routes/themes'));
app.use('/api/venues', require('./routes/venues')); 
app.use('/api/services', require('./routes/services'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.json({ message: 'iCore Celebrations API is running' });
});

//use port from .env file or default to 3001 if not set
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Test database connection when server starts 
  db.query('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err.message));
});

