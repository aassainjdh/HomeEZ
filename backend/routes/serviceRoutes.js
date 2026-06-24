const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin'), upload.single('image'), createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, authorize('admin'), upload.single('image'), updateService)
  .delete(protect, authorize('admin'), deleteService);

module.exports = router;
