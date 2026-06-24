const Service = require('../models/Service');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter);

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const { title, category, description, price, duration } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path);
    }

    const service = await Service.create({
      title,
      category,
      description,
      price: Number(price),
      duration,
      image: imageUrl
    });

    res.status(201).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);

    if (req.file) {
      updates.image = await uploadToCloudinary(req.file.path);
    }

    service = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    await service.deleteOne();

    res.json({
      success: true,
      message: 'Service removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
