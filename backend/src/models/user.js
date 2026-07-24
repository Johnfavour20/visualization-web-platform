const db = require('../config/database');

const User = {
  create: (userData, callback) => {
    const { email, name } = userData;
    db.run(
      'INSERT INTO users (email, name) VALUES (?, ?)',
      [email, name],
      function(err) {
        callback(err, this.lastID);
      }
    );
  },

  findByEmail: (email, callback) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  findById: (id, callback) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  }
};

module.exports = User;
