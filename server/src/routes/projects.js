const router = require("express").Router();
const pool = require("../db");

// GET all projects
router.get("/", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM projects ORDER BY id DESC"
    );
    res.json(result.rows);
});

// POST new project
router.post("/", async (req, res) => {
    const { title, description, tech, github } = req.body;

    const result = await pool.query(
        "INSERT INTO projects (title, description, tech, github) VALUES ($1,$2,$3,$4) RETURNING *",
        [title, description, tech, github]
    );

    res.json(result.rows[0]);
});

module.exports = router;
