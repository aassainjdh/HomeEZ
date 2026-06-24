const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Get dashboard analytics (Admin dashboard)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalBookings = await Booking.countDocuments();

    // Calculate revenue (Only completed and paid bookings)
    const paidBookings = await Booking.find({
      status: 'completed',
      paymentStatus: 'paid'
    }).populate('serviceId');

    const totalRevenue = paidBookings.reduce((sum, booking) => {
      return sum + (booking.serviceId ? booking.serviceId.price : 0);
    }, 0);

    // Bookings status breakdown
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Bookings by category
    const bookingsByCategory = await Booking.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $group: {
          _id: '$service.category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Provider verification breakdown
    const providersByStatus = await Provider.aggregate([
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent bookings (last 5)
    const recentBookings = await Booking.find()
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .populate('serviceId')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalProviders,
        totalBookings,
        totalRevenue,
        bookingsByStatus: bookingsByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        bookingsByCategory: bookingsByCategory.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        providersByStatus: providersByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all providers for admin (including pending and rejected)
// @route   GET /api/admin/providers
// @access  Private/Admin
const getAllProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find()
      .populate('userId', 'name email phone address profileImage createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/Approve a service provider
// @route   PUT /api/admin/providers/:id/verify
// @access  Private/Admin
const verifyProvider = async (req, res, next) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'
    
    if (!['verified', 'rejected', 'pending'].includes(status)) {
      res.status(400);
      throw new Error('Invalid verification status');
    }

    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      res.status(404);
      throw new Error('Provider profile not found');
    }

    provider.verificationStatus = status;
    
    // If verified, enable availability by default
    if (status === 'verified') {
      provider.availability = true;
    } else {
      provider.availability = false;
    }

    await provider.save();

    res.json({
      success: true,
      message: `Provider status updated to ${status}`,
      provider
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Delete associated bookings
    if (user.role === 'customer') {
      await Booking.deleteMany({ customerId: user._id });
    } else if (user.role === 'provider') {
      await Booking.deleteMany({ providerId: user._id });
      await Provider.deleteOne({ userId: user._id });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and related profiles deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllProviders,
  verifyProvider,
  deleteUser
};
