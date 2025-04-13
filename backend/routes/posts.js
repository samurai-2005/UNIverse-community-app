const express = require("express");
const router = express.Router();
const pool = require("../db");

// Add a comment to a post
router.post("/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ error: "Author and content are required" });
  }

  try {
    const newComment = await pool.query(
      "INSERT INTO comments (post_id, author, content) VALUES ($1, $2, $3) RETURNING *",
      [id, author, content]
    );
    res.status(201).json(newComment.rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get comments for a post
router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
      [id]
    );
    res.json(comments.rows);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Like a post
router.post("/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPost = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );

    if (updatedPost.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post liked successfully", post: updatedPost.rows[0] });
  } catch (err) {
    console.error("Error liking post:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

// routes/posts.js
router.get('/:community/posts', async (req, res) => {
  try {
    const posts = await pool.query(`
      SELECT p.*, COUNT(c.id) as comment_count 
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE p.community = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [req.params.community]);
    
    res.json(posts.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});