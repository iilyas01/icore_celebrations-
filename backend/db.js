const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to the MySQL database using credentials from environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); 
// Export the promise-based pool to be used in other parts of the application for executing queries with async/await syntax.
const promisePool = pool.promise();
// This allows other modules to import the promisePool and use it to interact with the database using async/await for cleaner and more readable code when performing database operations.
module.exports = promisePool;