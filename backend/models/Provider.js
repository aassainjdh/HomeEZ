const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  services: [{
    type: String,
    enum: [
      'Plumbing',
      'Electrical',
      'House Cleaning',
      'AC Repair',
      'Appliance Repair',
      'Painting',
      'Pest Control',
      'Carpentry'
    ]
  }],
  experience: {
    type: Number,
    required: [true, 'Please specify your years of experience'],
    default: 0
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  availability: {
    type: Boolean,
    default: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Provider', ProviderSchema);
