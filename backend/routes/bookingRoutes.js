const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('customer'), createBooking)
  .get(protect, getBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;
