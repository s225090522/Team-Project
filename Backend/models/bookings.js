const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
}, { timestamps: true });

module.exports = mongoose.model('bookings', bookingSchema);
