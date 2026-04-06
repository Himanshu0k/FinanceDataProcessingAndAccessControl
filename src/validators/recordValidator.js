const { body, query, param } = require('express-validator');

const createRecordValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2 })
    .withMessage('Category must be at least 2 characters long'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('description')
    .optional()
    .trim()
];

const updateRecordValidator = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Category must be at least 2 characters long'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('description')
    .optional()
    .trim()
];

const getRecordsQueryValidator = [
  query('type')
    .optional()
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  query('category')
    .optional()
    .trim(),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min amount must be a positive number'),
  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max amount must be a positive number'),
  query('search')
    .optional()
    .trim(),
  query('sortBy')
    .optional()
    .isIn(['date', 'amount', 'category', 'type', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const bulkDeleteValidator = [
  body('recordIds')
    .isArray({ min: 1 })
    .withMessage('recordIds must be a non-empty array'),
  body('recordIds.*')
    .isUUID()
    .withMessage('Each recordId must be a valid UUID')
];

module.exports = {
  createRecordValidator,
  updateRecordValidator,
  getRecordsQueryValidator,
  bulkDeleteValidator
};