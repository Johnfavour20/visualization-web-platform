const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ===================================
// GET USER BY EMAIL
// GET /api/users?email=user@example.com
// ===================================
router.get("/", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email query parameter is required.",
    });
  }

  User.findByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error.",
      });
    }

    if (!user) {
      return res.json([]);
    }

    res.json([user]);
  });
});

// ===================================
// CREATE USER
// POST /api/users
// ===================================
router.post("/", (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required.",
    });
  }

  User.findByEmail(email, (err, existingUser) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error.",
      });
    }

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    User.create({ email, name }, (err, userId) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to create user.",
        });
      }

      User.findById(userId, (err, newUser) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Database error.",
          });
        }

        res.status(201).json(newUser);
      });
    });
  });
});

module.exports = router;