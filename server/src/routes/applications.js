const router = require("express").Router();
const pool = require("../db");

// GET all applications
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM applications ORDER BY id DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("GET /applications error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST new application
router.post("/", async (req, res) => {
    try {
        const { company, role, status } = req.body;
        const result = await pool.query(
            "INSERT INTO applications (company, role, status) VALUES ($1,$2,$3) RETURNING *",
            [company, role, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("POST /applications error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE application
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { company, role, status } = req.body;

        const result = await pool.query(
            "UPDATE applications SET company=$1, role=$2, status=$3 WHERE id=$4 RETURNING *",
            [company, role, status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("PUT /applications/:id error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE application
router.delete("/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM applications WHERE id=$1", [req.params.id]);
        res.sendStatus(204);
    } catch (err) {
        console.error("DELETE /applications/:id error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
