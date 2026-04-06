const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const {
  createRecordValidator,
  updateRecordValidator,
  getRecordsQueryValidator,
  bulkDeleteValidator
} = require('../validators/recordValidator');
const validate = require('../middleware/validationMiddleware');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authenticate);

// Get all records with filters - All roles can access (filtered by role)
router.get(
  '/',
  getRecordsQueryValidator,
  validate,
  recordController.getAllRecords
);

// Get records grouped by category - All roles
router.get(
  '/category-summary',
  recordController.getRecordsByCategory
);

// Get records by user ID - ANALYST and ADMIN can view any user, VIEWER only themselves
router.get(
  '/user/:userId',
  authorize('VIEWER', 'ANALYST', 'ADMIN'),
  getRecordsQueryValidator,
  validate,
  recordController.getRecordsByUserId
);

// Get single record by ID - All roles (filtered by ownership for VIEWER)
router.get(
  '/:id',
  recordController.getRecordById
);

// Create record - ADMIN and VIEWER (VIEWER can create own records)
router.post(
  '/',
  authorize('ADMIN', 'VIEWER'),
  createRecordValidator,
  validate,
  recordController.createRecord
);

// Update record - ADMIN can update any, VIEWER can update own
router.put(
  '/:id',
  authorize('ADMIN', 'VIEWER'),
  updateRecordValidator,
  validate,
  recordController.updateRecord
);

// Bulk delete records - ADMIN can delete any, VIEWER can delete own
router.post(
  '/bulk-delete',
  authorize('ADMIN', 'VIEWER'),
  bulkDeleteValidator,
  validate,
  recordController.bulkDeleteRecords
);

// Delete single record - ADMIN can delete any, VIEWER can delete own
router.delete(
  '/:id',
  authorize('ADMIN', 'VIEWER'),
  recordController.deleteRecord
);

module.exports = router;