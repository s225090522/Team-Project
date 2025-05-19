const express = require('express');
const router = express.Router();

// GET /api/user/:id
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ userId, name: 'John Doe' });
});

module.exports = router;
