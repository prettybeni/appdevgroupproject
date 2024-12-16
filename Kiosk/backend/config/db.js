//config/db.js
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // Replace with actual password if needed
  database: 'ecomk',
  waitForConnections: true,  // Wait for a connection to be available
  connectionLimit: 10,  // Max number of connections in the pool
  queueLimit: 0,  // Unlimited waiting queries
  // Unlimited queue of waiting connections
});

// Export the promise-based pool
const db = pool.promise();

module.exports = db;
