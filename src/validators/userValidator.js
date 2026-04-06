const { body, query } = require('express-validator');

const createUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('role')
    .optional()
    .isIn(['VIEWER', 'ANALYST', 'ADMIN'])
    .withMessage('Invalid role. Must be VIEWER, ANALYST, or ADMIN')
];

const updateUserValidator = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('role')
    .optional()
    .isIn(['VIEWER', 'ANALYST', 'ADMIN'])
    .withMessage('Invalid role. Must be VIEWER, ANALYST, or ADMIN'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Invalid status. Must be ACTIVE or INACTIVE'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const getUsersQueryValidator = [
  query('role')
    .optional()
    .isIn(['VIEWER', 'ANALYST', 'ADMIN'])
    .withMessage('Invalid role filter'),
  query('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Invalid status filter'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search query must be at least 2 characters')
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  getUsersQueryValidator
};