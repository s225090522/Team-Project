const express = require('express');
const router = express.Router();
const appointment = require('../models/bookings');

// POST route to book an appointment
router.post('/book', (req, res) => {
  console.log('Received data:', req.body); // Debugging line
  const { name, service, date, time } = req.body;

  // Validate the input
  if (!name || !service || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  appointment.create({ name, service, date, time })
    .then((newAppointment) => {
      res.status(201).json({
        message: 'Appointment booked successfully',
        appointment: newAppointment,
      });
    })
    .catch((error) => {
      console.error('Error booking appointment:', error);
      res.status(500).json({ error: 'Failed to book appointment' });
    });
});

module.exports = router;
