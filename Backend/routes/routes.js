
const express = require('express');
const router = express.Router();

router.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend API!' });
});

router.post('/api/echo', (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

router.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;

  res.json({ userId, name: 'John Doe' });
});

router.all(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

module.exports = router;
