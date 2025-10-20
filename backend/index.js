// index.js (server entry)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

dotenv.config();

// --- DB ---
connectDB();
// Always return the UPDATED doc for findOneAndUpdate/findByIdAndUpdate
mongoose.set("returnOriginal", false); // equivalent to { new: true }
mongoose.set("runValidators", true); // enforce schema validators on updates

// --- App ---
const app = express();

// CORS (allow your frontend origin; fallback to * for local dev)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: false,
  })
);

// Body parsing
app.use(express.json());

// --- Routes ---
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

// --- Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
