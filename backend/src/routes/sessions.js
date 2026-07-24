const express = require('express');
const router = express.Router();
const Session = require('../models/session');

// Create session
router.post('/', (req, res) => {
  Session.create(req.body, (err, sessionId) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create session' });
    }
    Session.findById(sessionId, (err, newSession) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json(newSession);
    });
  });
});

// Get user sessions
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  Session.findAllByUserId(userId, (err, sessions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(sessions);
  });
});

// Get specific session
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Session.findById(id, (err, session) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  });
});

// Delete session
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Session.deleteById(id, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete session' });
    }
    res.json({ message: 'Session deleted successfully' });
  });
});

module.exports = router;
