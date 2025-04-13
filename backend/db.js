// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

// db.js - Simplify SSL config
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      require: true
    }
  });

module.exports = pool;