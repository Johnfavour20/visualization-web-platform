const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get users (optionally filter by email)
router.get('/', (req, res) => {
  const { email } = req.query;
  if (email) {
    User.findByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.json([]);
      }
      res.json([user]);
    });
  } else {
    // Optionally get all users (for now, just return empty array)
    res.json([]);
  }
});

// Create user
router.post('/', (req, res) => {
  const { email, name } = req.body;
  
  User.findByEmail(email, (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (existingUser) {
      return res.json(existingUser);
    }
    
    User.create({ email, name }, (err, userId) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
      User.findById(userId, (err, newUser) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json(newUser);
      });
    });
  });
});

module.exports = router;
