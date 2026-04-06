const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware');
const { query } = require('express-validator');
const validate = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(authenticate);

// Query validators
const dateRangeValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

const yearValidator = [
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100')
];

const periodValidator = [
  query('period')
    .optional()
    .isIn(['monthly', 'quarterly', 'yearly'])
    .withMessage('Period must be monthly, quarterly, or yearly')
];

// Get overview statistics
router.get(
  '/overview',
  dateRangeValidator,
  validate,
  dashboardController.getOverview
);

// Get category breakdown
router.get(
  '/category-breakdown',
  [...dateRangeValidator, query('type').optional().isIn(['INCOME', 'EXPENSE'])],
  validate,
  dashboardController.getCategoryBreakdown
);

// Get recent activity
router.get(
  '/recent-activity',
  [query('limit').optional().isInt({ min: 1, max: 50 })],
  validate,
  dashboardController.getRecentActivity
);

// Get monthly trends
router.get(
  '/monthly-trends',
  yearValidator,
  validate,
  dashboardController.getMonthlyTrends
);

// Get weekly trends
router.get(
  '/weekly-trends',
  dashboardController.getWeeklyTrends
);

// Get top categories
router.get(
  '/top-categories',
  [
    query('type').optional().isIn(['INCOME', 'EXPENSE']),
    query('limit').optional().isInt({ min: 1, max: 20 })
  ],
  validate,
  dashboardController.getTopCategories
);

// Get income vs expense comparison
router.get(
  '/income-expense-comparison',
  [...periodValidator, ...yearValidator],
  validate,
  dashboardController.getIncomeExpenseComparison
);

// Get financial health score
router.get(
  '/financial-health',
  dashboardController.getFinancialHealth
);

module.exports = router;