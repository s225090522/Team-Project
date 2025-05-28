const express = require('express');
const router = express.Router();
const appointment = require('../models/bookings');
const protect = require('../middleware/authProtect');

// POST route to book an appointment
router.post('/book', (req, res, next) => {
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
      // res.status(500).json({ error: 'Failed to book appointment' });
      next(error);
    });
});

router.get('/allbookings', protect, async (req, res, next) => {
  console.log('get all bookings');
  await appointment.find({})
    .then((bookings) => {
      res.status(200).json({
        message: 'All bookings retrieved successfully',
        bookings,
      });
    })
    .catch((error) => {
      console.error('Error retrieving bookings:', error);
      // res.status(500).json({ error: 'Failed to retrieve bookings' });
      next(error);
    });
});

router.delete('/delete/:id', protect, async (req, res, next) => {
  const { id } = req.params;
  console.log('Deleting appointment with ID:', id);

  try {
    const deletedAppointment = await appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({
      message: 'Appointment deleted successfully',
      appointment: deletedAppointment,
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    next(error);
  }
});

router.put('/update/:id', protect, async (req, res, next) => {
  const { id } = req.params;
  const { name, service, date, time } = req.body;

  // Validate the input
  if (!name || !service || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedAppointment = await appointment.findByIdAndUpdate(
      id,
      { name, service, date, time },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    next(error);
  }
});

module.exports = router;
