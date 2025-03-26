require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const postRoutes = require("./routes/posts");
app.use("/api/posts", postRoutes);

const app = express();
app.use(express.json());
app.use(cors());

// Connect to Supabase/PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test API
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
