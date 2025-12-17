const router = require("express").Router();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/project-feedback", async (req, res) => {
    try {
        const { title, description, tech } = req.body;

        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: `
You are a senior software engineer.

Analyze this student project and return feedback.

Project title: ${title}
Description: ${description}
Tech stack: ${tech.join(", ")}

Respond with helpful, resume-focused feedback.
`,
        });

        const output = response.output_text;

        console.log("AI OUTPUT:", output);

        res.json({ feedback: output });
    } catch (err) {
        console.error("OPENAI ERROR:", err.message);
        res.status(500).json({ error: "AI feedback failed" });
    }
});

module.exports = router;
