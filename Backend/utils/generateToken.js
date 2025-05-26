const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'yoursecretkey', // Use dotenv in production!
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Default to 1 hour if not set
  );
};

module.exports = generateToken;
