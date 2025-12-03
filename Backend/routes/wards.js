const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');
const Facility = require('../models/Facility');

// Get all wards with facility counts
router.get('/', async (req, res) => {
  try {
    const wards = await Ward.find().populate('facilities');
    res.json(wards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific ward by number
router.get('/:wardNumber', async (req, res) => {
  try {
    const ward = await Ward.findOne({ 
      wardNumber: req.params.wardNumber 
    }).populate('facilities');
    res.json(ward);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get facilities in a ward
router.get('/:wardNumber/facilities', async (req, res) => {
  try {
    const facilities = await Facility.find({ 
      wardNumber: req.params.wardNumber 
    });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;