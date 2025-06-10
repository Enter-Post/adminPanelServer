const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and assign token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error details:', {
      message: err.message,
      stack: err.stack,
      body: req.body
    });
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Create initial admin user (you can remove this route after creating the admin)
router.post('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    // Create new admin
    const admin = new Admin({
      email: 'admin@gmail.com',
      password: 'admin123'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (err) {
    console.error('Create admin error details:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router; 