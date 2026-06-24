const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// @desc    Create a review for a service provider
// @route   POST /api/reviews
// @access  Private (Customer only)
const createReview = async (req, res, next) => {
  try {
    const { providerId, rating, comment } = req.body;

    // Verify provider exists
    const provider = await Provider.findOne({ userId: providerId });
    if (!provider) {
      res.status(404);
      throw new Error('Provider not found');
    }

    // Verify customer has a completed booking with this provider
    const completedBooking = await Booking.findOne({
      customerId: req.user._id,
      providerId,
      status: 'completed'
    });

    if (!completedBooking) {
      res.status(400);
      throw new Error('You can only review providers who have completed a booking for you');
    }

    // Check if review already exists from this customer for this provider
    const existingReview = await Review.findOne({
      customerId: req.user._id,
      providerId
    });

    let review;
    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      review = await existingReview.save();
    } else {
      review = await Review.create({
        customerId: req.user._id,
        providerId,
        rating: Number(rating),
        comment
      });
    }

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a service provider
// @route   GET /api/reviews/provider/:id
// @access  Public
const getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ providerId: req.params.id })
      .populate('customerId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProviderReviews
};
