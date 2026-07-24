const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    }
  });

  // Create sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      input_data TEXT NOT NULL,
      key_data TEXT NOT NULL,
      output_data TEXT,
      aes_variant TEXT DEFAULT 'AES-128',
      duration INTEGER DEFAULT 0,
      completion_status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating sessions table:', err.message);
    } else {
      // Add columns if they don't exist (for existing databases)
      addColumnIfNotExists('sessions', 'aes_variant', 'TEXT DEFAULT "AES-128"');
      addColumnIfNotExists('sessions', 'duration', 'INTEGER DEFAULT 0');
      addColumnIfNotExists('sessions', 'completion_status', 'TEXT DEFAULT "completed"');
    }
  });
}

function addColumnIfNotExists(table, column, definition) {
  // Check if column exists
  db.all(`PRAGMA table_info(${table})`, (err, columns) => {
    if (err) {
      console.error(`Error checking columns for ${table}:`, err.message);
      return;
    }
    const columnExists = columns.some(c => c.name === column);
    if (!columnExists) {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`, (err) => {
        if (err) {
          console.error(`Error adding column ${column} to ${table}:`, err.message);
        } else {
          console.log(`Added column ${column} to ${table}`);
        }
      });
    }
  });
}

module.exports = db;
