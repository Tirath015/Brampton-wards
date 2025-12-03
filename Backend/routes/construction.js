const express = require('express');
const router = express.Router();
const Construction = require('../models/Construction');

// Get all constructions
router.get('/', async (req, res) => {
  try {
    const constructions = await Construction.find();
    res.json(constructions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get constructions by ward
router.get('/ward/:wardNumber', async (req, res) => {
  try {
    const wardNumber = parseInt(req.params.wardNumber);
    const constructions = await Construction.find({ wardNumber });
    res.json(constructions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
