const express = require('express');
const router = express.Router();
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
//const cors = require('cors');
//const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const apiRoutes = require('./routes/routes');

// Load environment variables
// dotenv.config();

// Connect to MongoDB
// connectDB();

/* const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Authentication routes

// Handle 404 Errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.stack}`);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Export app for testing
if (process.env.NODE_ENV !== 'test') {
  // Start the server only if not in test mode
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} */

/* router.all('*', (req,res) => {
    res.status(404).json({error: 'API route not found'});
}); */

module.exports = router;
