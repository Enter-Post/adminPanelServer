const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  schoolName: {
    type: String,
    required: true,
    trim: true
  },
  baseUrl: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  website: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  logo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text index for search
schoolSchema.index({ schoolName: 'text' });

const School = mongoose.model('School', schoolSchema);

module.exports = School; 