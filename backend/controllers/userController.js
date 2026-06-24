const User = require('../models/User');
const Provider = require('../models/Provider');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    // Check for uploaded file
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path);
      user.profileImage = imageUrl;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profileImage: updatedUser.profileImage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update provider details
// @route   PUT /api/users/provider-profile
// @access  Private (Provider only)
const updateProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });

    if (!provider) {
      res.status(404);
      throw new Error('Provider profile not found');
    }

    // Update fields
    if (req.body.services) {
      // Expecting array of service strings or parse JSON array string
      let serviceArr = req.body.services;
      if (typeof serviceArr === 'string') {
        try {
          serviceArr = JSON.parse(serviceArr);
        } catch (e) {
          serviceArr = serviceArr.split(',').map(s => s.trim());
        }
      }
      provider.services = serviceArr;
    }

    if (req.body.experience !== undefined) {
      provider.experience = Number(req.body.experience);
    }

    if (req.body.description !== undefined) {
      provider.description = req.body.description;
    }

    if (req.body.availability !== undefined) {
      // support both boolean and string coercion
      provider.availability = req.body.availability === 'true' || req.body.availability === true;
    }

    const updatedProvider = await provider.save();

    res.json({
      success: true,
      provider: updatedProvider
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active service providers (optionally filter by service category)
// @route   GET /api/users/providers
// @access  Public
const getProviders = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    
    // Find verified providers
    const filter = { verificationStatus: 'verified' };
    
    if (category) {
      filter.services = category;
    }

    const providers = await Provider.find(filter).populate('userId', 'name email phone address profileImage');
    
    // Filter by search query on provider name
    let result = providers;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      result = providers.filter(p => p.userId && searchRegex.test(p.userId.name));
    }

    res.json({
      success: true,
      count: result.length,
      providers: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get provider by ID
// @route   GET /api/users/providers/:id
// @access  Public
const getProviderById = async (req, res, next) => {
  try {
    // Note: :id is the userId of the provider
    const provider = await Provider.findOne({ userId: req.params.id }).populate('userId', 'name email phone address profileImage');
    
    if (!provider) {
      res.status(404);
      throw new Error('Provider not found');
    }

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUserProfile,
  updateProviderProfile,
  getProviders,
  getProviderById
};
