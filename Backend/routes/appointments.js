const express = require('express');
const router = express.Router();

// POST route to book an appointment
router.post('/book', (req, res) => {
  console.log('Received data:', req.body); // Debugging line
  const { name, service, date, time } = req.body;

  // Validate the input
  if (!name || !service || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Simulate saving the appointment to a database
  const appointment = { id: Date.now(), name, service, date, time };

  // Respond with a success message
  res.status(201).json({
    message: 'Appointment booked successfully',
    appointment,
  });
});

module.exports = router;
