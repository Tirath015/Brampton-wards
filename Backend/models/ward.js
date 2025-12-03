const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardNumber: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  geometry: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]],
      required: true
    }
  },
  population: {
    type: Number,
    default: 0
  },
  facilities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility'
  }],
  facilityCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Ward', wardSchema);