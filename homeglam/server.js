const express = require('express');
const path = require('path');
const cors = require('cors');

// const apiRoutes = require('./Backend');
const authRoutes = require('./Backend/routes/auth');
const appointmentRoutes = require('./Backend/routes/appointments');
const logger = require('./backend/middleware/logger');
const errorHandler = require('./backend/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// === Global Middlewares ===
app.use(cors());                // Enable CORS (for frontend-backend)
app.use(express.json());        // Parse JSON body
app.use(logger);                // Log all requests

// === Global Error Handler ===
app.use(errorHandler);

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/:folder/:file', (req, res) => {
  const { folder, file } = req.params;
  const filePath = path.join(__dirname, 'frontend', folder, `${file}.html`);
  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

app.get(/^\/(.+\.html)$/, (req, res) => {
  const filePath = path.join(__dirname, 'frontend', req.params[0]);
  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);


// app.use('/api/auth', require('./Backend/routes/auth'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
