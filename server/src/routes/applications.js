const router = require("express").Router();
const pool = require("../db");

// GET all applications
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM applications ORDER BY id DESC"
  );
  res.json(result.rows);
});

// POST new application
router.post("/", async (req, res) => {
  const { company, role, status } = req.body;
  const result = await pool.query(
    "INSERT INTO applications (company, role, status) VALUES ($1,$2,$3) RETURNING *",
    [company, role, status]
  );
  res.json(result.rows[0]);
});

// UPDATE application
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { company, role, status } = req.body;

  const result = await pool.query(
    "UPDATE applications SET company=$1, role=$2, status=$3 WHERE id=$4 RETURNING *",
    [company, role, status, id]
  );
  res.json(result.rows[0]);
});

// DELETE application
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM applications WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
