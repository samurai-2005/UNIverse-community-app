const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    res.json(posts.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
router.post("/", async (req, res) => {
  const { author, content } = req.body;
  try {
    const newPost = await pool.query(
      "INSERT INTO posts (author, content, likes) VALUES ($1, $2, 0) RETURNING *",
      [author, content]
    );
    res.json(newPost.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
