// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

// Middleware
// server.js - CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Authentication middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (!user.rows.length) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    console.error(`JWT Error [${error.name}]:`, error.message);
    const message = error.name === 'TokenExpiredError' 
      ? "Token expired. Please login again" 
      : "Invalid authentication token";
    res.status(401).json({ error: message });
  }
};

// Routes
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Replace with actual authentication logic
    const user = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND password = crypt($2, password)',
      [email, password]
    );

    if (!user.rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.rows[0].id, email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/posts", authenticate, async (req, res) => {
  try {
    const { community } = req.query;
    if (!community) {
      return res.status(400).json({ error: "Community parameter is required" });
    }

    const result = await pool.query(
      `SELECT p.*, u.username as author_name 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE community = $1
       ORDER BY created_at DESC`,
      [community]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Debug endpoint
app.get("/api/debug-token", authenticate, (req, res) => {
  res.json({
    user: req.user,
    valid: true,
    message: "Token is valid"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database connected to: ${process.env.DATABASE_URL?.split('@')[1]}`);
});