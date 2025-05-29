const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role || 'user' , name: user.name }, // Include role if available
    process.env.JWT_SECRET || 'yoursecretkey', // Use dotenv in production!
    {
      expiresIn: process.env.JWT_EXPIRATION || '15m'
    } // Default to 1 hour if not set
  );
};

module.exports = generateToken;
