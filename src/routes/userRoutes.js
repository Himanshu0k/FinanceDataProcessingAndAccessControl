const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  createUserValidator,
  updateUserValidator,
  getUsersQueryValidator
} = require('../validators/userValidator');
const validate = require('../middleware/validationMiddleware');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authenticate);

// Get all users - ANALYST and ADMIN can view
router.get(
  '/',
  authorize('ANALYST', 'ADMIN'),
  getUsersQueryValidator,
  validate,
  userController.getAllUsers
);

// Get user by ID - ANALYST and ADMIN can view
router.get(
  '/:id',
  authorize('ANALYST', 'ADMIN'),
  userController.getUserById
);

// Get user statistics - ANALYST and ADMIN can view
router.get(
  '/:id/stats',
  authorize('ANALYST', 'ADMIN'),
  userController.getUserStats
);

// Create user - Only ADMIN
router.post(
  '/',
  authorize('ADMIN'),
  createUserValidator,
  validate,
  userController.createUser
);

// Update user - Only ADMIN
router.put(
  '/:id',
  authorize('ADMIN'),
  updateUserValidator,
  validate,
  userController.updateUser
);

// Toggle user status - Only ADMIN
router.patch(
  '/:id/toggle-status',
  authorize('ADMIN'),
  userController.toggleUserStatus
);

// Delete user - Only ADMIN
router.delete(
  '/:id',
  authorize('ADMIN'),
  userController.deleteUser
);

module.exports = router;