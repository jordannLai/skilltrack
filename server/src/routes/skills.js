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

// UPDATE skill
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, level } = req.body;

  const result = await pool.query(
    "UPDATE skills SET name=$1, level=$2 WHERE id=$3 RETURNING *",
    [name, level, id]
  );

  res.json(result.rows[0]);
});

// DELETE skill
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM skills WHERE id = $1",
    [id]
  );

  res.sendStatus(204);
});

module.exports = router;
