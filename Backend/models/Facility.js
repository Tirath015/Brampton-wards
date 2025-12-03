const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: String,
  type: String, // 'school', 'police', 'fire', 'healthcare'
  wardNumber: Number,
  address: String,  
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  }
});

module.exports = mongoose.model('Facility', facilitySchema);