
const express = require('express');
const router = express.Router();
const enquire = require('../models/enquiry');

router.post('/enquire', async (req, res, next) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const enquireData = await enquire.create({ name, email, message });
  if (!enquireData) {
    return res.status(500).json({ error: 'Failed to create enquiry' });
  }
  res.status(200).json({ message: 'enquiry submitted successfully', enquireData });
});



router.all(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

module.exports = router;
