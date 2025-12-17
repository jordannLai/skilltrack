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

// UPDATE project
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, tech, github } = req.body;

    const result = await pool.query(
        "UPDATE projects SET title=$1, description=$2, tech=$3, github=$4 WHERE id=$5 RETURNING *",
        [title, description, tech, github, id]
    );

    res.json(result.rows[0]);
});

// DELETE project
router.delete("/:id", async (req, res) => {
    await pool.query(
        "DELETE FROM projects WHERE id = $1",
        [req.params.id]
    );

    res.sendStatus(204);
});

module.exports = router;
