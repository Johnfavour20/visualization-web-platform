const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/users");
const sessionRoutes = require("./routes/sessions");

const app = express();

// ===================================
// Middleware
// ===================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://visualization-web-platform.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ===================================
// API Routes
// ===================================
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);

// ===================================
// Root Route
// ===================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AES Visualizer Backend API is running 🚀",
    version: "1.0.0",
  });
});

// ===================================
// Health Check
// ===================================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ===================================
// 404 Handler
// ===================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===================================
// Global Error Handler
// ===================================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===================================
// Start Server
// ===================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});