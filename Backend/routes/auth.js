const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if(name == "dhanush"
    && email == "admin@gmail.com"
    && password == "password") {
      res.status(201).json({ message: 'User created successfully', user: { name, email } })
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: 'User created successfully', user: { name, email } });
  } catch (error) {
    next(err);
    // res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login Route
// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  console.log('trying to login');
  const { email, password } = req.body;

  try {

    if (email === 'admin@gmail.com' && password === 'password') {
      res.json({ success: true, token: 'fake-jwt-token' });
    }
    else {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
   }
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;
