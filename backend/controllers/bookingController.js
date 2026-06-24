const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Provider = require('../models/Provider');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer only)
const createBooking = async (req, res, next) => {
  try {
    const { providerId, serviceId, bookingDate, address, notes } = req.body;

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    // Verify provider exists and offers this service category
    const provider = await Provider.findOne({ userId: providerId, verificationStatus: 'verified' });
    if (!provider) {
      res.status(400);
      throw new Error('Provider not found or not verified');
    }

    if (!provider.services.includes(service.category)) {
      res.status(400);
      throw new Error('This provider does not offer the selected service category');
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      providerId,
      serviceId,
      bookingDate,
      address,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query = { customerId: req.user._id };
    } else if (req.user.role === 'provider') {
      query = { providerId: req.user._id };
    } // Admin sees all bookings

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone profileImage')
      .populate('providerId', 'name email phone profileImage')
      .populate('serviceId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone profileImage')
      .populate('providerId', 'name email phone profileImage')
      .populate('serviceId');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Access check: User must be customer, provider, or admin
    if (
      req.user.role !== 'admin' &&
      booking.customerId._id.toString() !== req.user._id.toString() &&
      booking.providerId._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to access this booking');
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Access authorization checks:
    if (req.user.role === 'customer') {
      // Customers can only cancel their own bookings (and only if it hasn't started yet)
      if (booking.customerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to modify this booking');
      }
      if (status !== 'cancelled') {
        res.status(400);
        throw new Error('Customers can only cancel bookings');
      }
      if (['in-progress', 'completed', 'rejected', 'cancelled'].includes(booking.status)) {
        res.status(400);
        throw new Error('This booking cannot be cancelled at its current stage');
      }
    } else if (req.user.role === 'provider') {
      // Providers can only update bookings assigned to them
      if (booking.providerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to modify this booking');
      }
      const allowedStatus = ['accepted', 'rejected', 'in-progress', 'completed'];
      if (!allowedStatus.includes(status)) {
        res.status(400);
        throw new Error('Providers are not authorized to set this status');
      }
    } // Admins can update to any status

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Customers can pay, Admin can update anything, Provider can verify payments
    if (
      req.user.role !== 'admin' &&
      booking.customerId.toString() !== req.user._id.toString() &&
      booking.providerId.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to modify this booking');
    }

    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus
};
