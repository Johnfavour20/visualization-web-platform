// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const usersRouter = require('./routes/users');
const sessionsRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
