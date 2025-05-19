const express = require('express');
const bodyParser = require('body-parser');
const appointmentsRouter = require('./routes/appointments');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/appointments', appointmentsRouter);

// ...existing code...
module.exports = app;
