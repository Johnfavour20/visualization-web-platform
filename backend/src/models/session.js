const db = require('../config/database');

const Session = {
  create: (sessionData, callback) => {
    const { userId, inputData, keyData, outputData, aesVariant, duration, completionStatus } = sessionData;
    db.run(
      'INSERT INTO sessions (user_id, input_data, key_data, output_data, aes_variant, duration, completion_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, inputData, keyData, outputData, aesVariant || 'AES-128', duration || 0, completionStatus || 'completed'],
      function(err) {
        callback(err, this.lastID);
      }
    );
  },

  findAllByUserId: (userId, callback) => {
    db.all('SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC', [userId], callback);
  },

  findById: (id, callback) => {
    db.get('SELECT * FROM sessions WHERE id = ?', [id], callback);
  },

  deleteById: (id, callback) => {
    db.run('DELETE FROM sessions WHERE id = ?', [id], callback);
  }
};

module.exports = Session;
