const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
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
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  duration: {
    type: String,
    required: [true, 'Please specify duration (e.g. 1-2 hours)']
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);
