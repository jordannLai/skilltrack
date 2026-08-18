require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/applications", require("./routes/applications"));
app.use("/projects", require("./routes/projects"));
app.use("/skills", require("./routes/skills"));
app.use("/analytics", require("./routes/analytics"));
app.use("/ai", require("./routes/ai"));


const PORT = process.env.PORT || 5000;

if (require.main === module) {
        app.listen(PORT, () => {
                    console.log(`Server running on port ${PORT}`);
        });
}

module.exports = app;
