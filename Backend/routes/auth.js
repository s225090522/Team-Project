const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const protect = require('../middleware/authProtect');

const router = express.Router();

router.get('/view',protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User details', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Signup Route
router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role: name == 'admin' ? 'admin' : 'user' });

    res.status(201).json({ message: 'User created successfully', user: { name, email }, token: generateToken(user) });
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
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email
      }});
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// ✏️ Update User (Protected)
router.put('/update', protect, async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: 'User updated', user: { name: user.name, email: user.email } });
  } catch (err) {
    next(err);
    // res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete User (Protected)
router.delete('/delete', protect, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User account deleted' });
  } catch (err) {
    next(err);
    // res.status(500).json({ error: err.message });
  }
});

module.exports = router;
