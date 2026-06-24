const express = require('express');
const router = express.Router();
const {
  updateUserProfile,
  updateProviderProfile,
  getProviders,
  getProviderById
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);
router.put('/provider-profile', protect, authorize('provider'), updateProviderProfile);
router.get('/providers', getProviders);
router.get('/providers/:id', getProviderById);

module.exports = router;
