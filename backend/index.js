// index.js (server entry)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
// --- Create default demo user if not exists ---
const User = require("./models/User");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    const existingDemo = await User.findOne({ email: "demo@taskify.com" });
    if (!existingDemo) {
      const hashed = await bcrypt.hash("Demo@123", 10);
      await User.create({
        name: "Demo User",
        email: "demo@taskify.com",
        password: hashed,
      });
      console.log("Demo user created: demo@taskify.com / Demo@123");
    } else {
      console.log("Demo user already exists");
    }
  } catch (err) {
    console.error("Error creating demo user:", err);
  }
})();
dotenv.config();

connectDB();

mongoose.set("returnOriginal", false);
mongoose.set("runValidators", true);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: false,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
