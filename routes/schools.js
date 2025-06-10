const express = require('express');
const router = express.Router();
const School = require('../models/School');
const auth = require('../middleware/auth');

// Search school by name
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'School name is required' });
    }

    console.log('Searching for school with name:', name);

    // Search in both name and schoolName fields
    const schools = await School.find({
      $or: [
        { name: { $regex: name, $options: 'i' } },
        { schoolName: { $regex: name, $options: 'i' } }
      ]
    }).limit(10);

    console.log('Search results:', schools);
    res.json(schools);
  } catch (err) {
    console.error('School search error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Get all schools
router.get('/', auth, async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    res.json(schools);
  } catch (err) {
    console.error('Get schools error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Create a new school
router.post('/', auth, async (req, res) => {
  try {
    const { schoolName, baseUrl } = req.body;
    
    if (!schoolName || !baseUrl) {
      return res.status(400).json({ 
        message: 'School name and base URL are required',
        details: 'Please provide both schoolName and baseUrl fields'
      });
    }
    
    const school = new School({
      schoolName,
      baseUrl
    });

    const savedSchool = await school.save();
    res.status(201).json(savedSchool);
  } catch (err) {
    console.error('Create school error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Delete a school
router.delete('/:id', auth, async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json({ message: 'School deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 