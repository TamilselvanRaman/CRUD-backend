const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();

const app = express();

// Enable CORS for frontend requests
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

connectDb();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
