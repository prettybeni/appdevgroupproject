const db = require('../config/db');

const userModel = {

  getUserById : (userId, callback) => {
    const query = "SELECT * FROM user WHERE id = ?";
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error finding user by id:', err);
        return callback(err);
      }
      callback(null, result[0]);
    });
  },

  updateUserProfile : (userId, userData) => {
    const { first_name, last_name, email, phone, username } = userData;
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, username = ? WHERE id = ?',
        [first_name, last_name, email, phone, username, userId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  findUserByToken: async (token) => {
        try {
            // Query the database for the user with the provided token
            const query = 'SELECT * FROM users WHERE cookie = ?'; // You should adjust this according to your token expiration logic
            const [user] = await db.execute(query, [token]);
            return user[0]; // Returning the first user if found
        } catch (error) {
            console.error('Error finding user by token:', error);
            throw error; // Re-throw error to be handled by controller
        }
    },

  findUserByEmailOrUsername: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
    const [rows] = await db.execute(query, [email, email]); 
    return rows.length > 0 ? rows[0] : null;
},

createUserToken : async (userId, token, expiryDate) => {
  try {
      await db.execute(
          'UPDATE users SET cookie = ?, cookie_expiry = ? WHERE id = ?',
          [token, expiryDate, userId]
      );
      return true;
  } catch (error) {
      console.error('Error updating user token:', error);
      throw error;
  }
}, 

validateUserToken : async (token) => {
  try {
      const [rows] = await db.execute(
          'SELECT id FROM users WHERE cookie = ?',
          [token]
      );

      if (rows.length > 0) {
          return rows[0].id; // Return the user id if the token is valid
      } else {
          return null; // Token is invalid or expired
      }
  } catch (error) {
      console.error('Error validating token:', error);
      throw error;
  }
},



deleteUserToken : async (userId) => {
  try {
      await db.execute(
          'UPDATE users SET cookie = NULL, cookie_expiry = NULL WHERE id = ?',
          [userId]
      );
      return true;
  } catch (error) {
      console.error('Error deleting user token:', error);
      throw error;
  }
},



    createUser: async (userData) => {
            const query = 'INSERT INTO users (username, first_name, last_name, email, phone, password, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [
                userData.username,
                userData.first_name,
                userData.last_name,
                userData.email,
                userData.phone,
                userData.password,
                userData.verification_token
            ]);
            return result;
    },

    findByVerificationToken : (token) => {
        return db.execute(
            'SELECT * FROM users WHERE verification_token = ?',
            [token]
        );
    },

    updateVerificationStatus : (token) => {
        return db.execute(
            'UPDATE users SET is_verified = 1 WHERE  verification_token = ?',
            [token]
        );
    },

    findUserByIdentifier: (identifier) => {
      return db.execute(
          'SELECT * FROM users WHERE email = ? OR username = ?',
          [identifier, identifier]
      )
      .then(([rows, fields]) => {
          return rows[0]; 
      })
  },
  
  saveResetToken: (userId, resetToken, resetTokenExpiration) => {
    return db.execute('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', [resetToken, resetTokenExpiration, userId])
},

 findByResetToken: (token) => {
  return db.execute(
    'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
    [token]
  )
  .then(([rows, fields]) => {
    return rows[0] || null; 
  })
},

updatePassword: (userId, hashedPassword) => {
  return db.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, userId]
  )
  .then(([result, fields]) => {
    return result; 
  })
},

clearResetToken: (userId) => {
  return db.execute(
    'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
    [userId]
  )
  .then(([result, fields]) => {
    return result; 
  })
},

getAllUsersByRole: async (role) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE role = ?',
    ['user']
  );
  return rows; // Return all matching users
},


};

module.exports = userModel;
