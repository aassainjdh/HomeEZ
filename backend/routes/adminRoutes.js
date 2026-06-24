const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  getAllProviders,
  verifyProvider,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/providers', getAllProviders);
router.put('/providers/:id/verify', verifyProvider);
router.delete('/users/:id', deleteUser);

module.exports = router;
