const router = require("express").Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const applications = await pool.query(
            "SELECT COUNT(*) FROM applications"
        );

        const activeApplications = await pool.query(
            "SELECT COUNT(*) FROM applications WHERE status != 'Rejected'"
        );

        const projects = await pool.query(
            "SELECT COUNT(*) FROM projects"
        );

        const skills = await pool.query(
            "SELECT COUNT(*) FROM skills"
        );

        res.json({
            applications: Number(applications.rows[0].count),
            activeApplications: Number(activeApplications.rows[0].count),
            projects: Number(projects.rows[0].count),
            skills: Number(skills.rows[0].count),
        });
    } catch (err) {
        console.error("GET /analytics error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
