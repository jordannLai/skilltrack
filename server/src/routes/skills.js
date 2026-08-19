const router = require("express").Router();
const pool = require("../db");

// GET all skills
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM skills ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("GET /skills error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST new skill
router.post("/", async (req, res) => {
    try {
        const { name, level } = req.body;

        const result = await pool.query(
            "INSERT INTO skills (name, level) VALUES ($1,$2) RETURNING *",
            [name, level]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("POST /skills error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE skill
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, level } = req.body;

        const result = await pool.query(
            "UPDATE skills SET name=$1, level=$2 WHERE id=$3 RETURNING *",
            [name, level, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("PUT /skills/:id error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE skill
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM skills WHERE id = $1",
            [id]
        );

        res.sendStatus(204);
    } catch (err) {
        console.error("DELETE /skills/:id error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
