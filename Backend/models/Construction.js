const mongoose = require('mongoose');

const constructionSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'In Progress'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  estimatedEndDate: {
    type: Date
  },
  description: {
    type: String
  },
  contractor: {
    type: String
  },
  budget: {
    type: Number
  },
  wardNumber: {
    type: Number,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // only Point allowed
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 2 && v.every(n => typeof n === 'number');
        },
        message: props => `${props.value} is not a valid coordinate [lng, lat]`
      }
    }
  },
  address: {
    type: String
  },
  roadClosure: {
    type: Boolean,
    default: false
  }
});

// 2dsphere index for geospatial queries
constructionSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Construction', constructionSchema);
