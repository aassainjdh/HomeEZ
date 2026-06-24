const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please select a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to get average rating and save it to Provider
ReviewSchema.statics.getAverageRating = async function (providerId) {
  const obj = await this.aggregate([
    {
      $match: { providerId }
    },
    {
      $group: {
        _id: '$providerId',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Provider').findOneAndUpdate(
        { userId: providerId },
        { rating: Math.round(obj[0].averageRating * 10) / 10 }
      );
    }
  } catch (err) {
    console.error(`Error calculating average rating: ${err.message}`);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.providerId);
});

module.exports = mongoose.model('Review', ReviewSchema);
