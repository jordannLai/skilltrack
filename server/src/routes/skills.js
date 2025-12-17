const router = require("express").Router();
const pool = require("../db");

// GET all skills
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM skills ORDER BY id ASC"
  );
  res.json(result.rows);
});

// POST new skill
router.post("/", async (req, res) => {
  const { name, level } = req.body;

  const result = await pool.query(
    "INSERT INTO skills (name, level) VALUES ($1,$2) RETURNING *",
    [name, level]
  );

  res.json(result.rows[0]);
});

module.exports = router;
